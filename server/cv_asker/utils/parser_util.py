import os
import re
import uuid
import json
import pymupdf
from google import genai

email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
mobile_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9-_.]+'
github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9-_.]+/?'


def _personal_info_replace(text: str, value: str, tag: str):
    return re.sub(re.escape(value), f"{tag}-hidden", text, flags=re.IGNORECASE)


def _write_text(file_path, doc):
    with open(file_path, "wb") as f:
        for page in doc:
            f.write(page.get_text().encode("utf8"))
            f.write(b"\f")
    doc.close()


def _read_text(file_path):
    with open(file_path, "r", encoding="utf8") as f:
        first = f.readline().strip()
        rest = f.read()
    os.remove(file_path)
    return first, rest


def _call_gemini(gemini_prompt):
    client = genai.Client(api_key=os.environ.get('GEMINI_API'))

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=gemini_prompt
    )

    return response


def pdf_parser(pdf_bytes: bytes, custom_fields=None):
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    temp_dir = os.path.join(os.path.dirname(__file__), "..", "temp_files")
    os.makedirs(temp_dir, exist_ok=True)
    temp_file = os.path.join(temp_dir, f"{uuid.uuid4().hex}.txt")

    _write_text(temp_file, doc)
    name, resume_string = _read_text(temp_file)

    # fmt: off
    match_email = re.search(email_pattern, resume_string)
    email = match_email.group() if match_email else None

    match_mobile = re.search(mobile_pattern, resume_string)
    mobile = match_mobile.group() if match_mobile else None

    match_linkedin = re.search(linkedin_pattern, resume_string)
    linkedin = match_linkedin.group() if match_linkedin else None

    match_github = re.search(github_pattern, resume_string)
    github = match_github.group() if match_github else None

    if type(email) == str:
        resume_string = _personal_info_replace(resume_string, email, 'email')

    elif type(email) == tuple:
        for mail in email:
            if email is not None:
                resume_string = _personal_info_replace(resume_string, mail, 'email')

    if type(mobile) == str:
        resume_string = _personal_info_replace(resume_string, mobile, 'mobile')

    elif type(mobile) == tuple:
        for num in mobile:
            if num is not None:
                resume_string = _personal_info_replace(resume_string, num, 'mobile')

    if type(linkedin) == str:
        resume_string = _personal_info_replace(resume_string, linkedin, 'linkedin')

    elif type(linkedin) == tuple:
        for link in linkedin:
            if link is not None:
                resume_string = _personal_info_replace(resume_string, link, 'linkedin')

    if (type(github) == str):
        resume_string = _personal_info_replace(resume_string, github, 'github')

    elif (type(github) == tuple):
        for link in github:
            if link is not None:
                resume_string = _personal_info_replace(resume_string, link, 'github')

    for field in custom_fields:
        for key, value in field.items():
            resume_string = _personal_info_replace(resume_string, value, key)

    gemini_prompt = f'''
                    You are a resume analyzer. I am providing you text content extracted from resume.
                    I have removed some personal info like name, mobile, email, linkedin URL, github URL, Company Names, College/School etc.
                    Go through the resume text content thoroughly and provide me key details mentioned below as a key-value pair. Nothing extra reason and all:

                    Experience Level: Integer (Only years, No months. Ex: 11 months is 0 and 14 months is 1. You can calculate this by summing each company's working period)
                    Skills: Array of string (Programming Languages, Project experience, Intern/Full-Time experience etc. Can be of Tech/Non-Tech background.)

                    Here is the resume content: {resume_string}
        '''.strip()

    # fmt: off
    response_string = _call_gemini(gemini_prompt)
    response_text = (getattr(response_string, 'text', None) or str(response_string)).strip()

    response = response_text.strip("```json").strip("```")
    response_json = json.loads(response)

    return response_json
