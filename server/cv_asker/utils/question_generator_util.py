import os
import json
from google import genai


def _call_gemini(gemini_prompt):
    client = genai.Client(api_key=os.environ.get('GEMINI_API'))

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=gemini_prompt
    )

    return response


def generate_question(skill, proficiency):
    gemini_prompt_old = f'''
                    You are an interviewer. You have been provided skill name and its proficiency level out of 10 by the candidate.
                    You have to ask the candidate questions on the given skill and their proficiency (1 being absolute beginner to 10 being extremenly experienced) in the form of mcq with 4 options.

                    Generate 50 questions in the form of an array containing 100 elements each being in the format [question,option_a,option_b,option_c,option_d,correct option(enum[a,b,c,d])].

                    Do not give anything in response just the desired array in the format provided above.
                    In case your question has new lines and indentations, use \\t and \\n etc accordingly so that it can be formatted while reading.

                    Skill: {skill}, Proficiency (out of 10): {proficiency}
        '''.strip()

    gemini_prompt = f'''
                    You are an interviewer AI evaluating a candidate's understanding of a specific technical skill. 
                    You are provided with:
                    - The skill name.
                    - The candidate's self-rated proficiency (1 = absolute beginner, 10 = extremely experienced).

                    Your task:
                    - Generate exactly 50 multiple-choice questions (MCQs) about the given skill.
                    - Questions must be **tailored to the provided proficiency level**, scaling **exponentially** in depth and difficulty:
                      - A small increase in proficiency (e.g., 6 → 7) should represent a **significant jump** in question complexity.
                      - Higher proficiency levels should test **conceptual reasoning, problem-solving, and practical application**, not just factual recall.
                      - Lower proficiency levels may include fundamental or definitional questions, but still require some understanding.

                    Format requirements:
                    - Output must be a **pure JSON array** of exactly 50 elements.
                    - Each element must follow this format strictly: ["question", "option_a", "option_b", "option_c", "option_d", "correct_option"]
                    - `correct_option` should be one of the strings: `"a"`, `"b"`, `"c"`, or `"d"`.
                    - **No extra text**, explanations, or markdown outside the array.
                    - If a question includes formatting (e.g., code, math, or line breaks), use escape sequences like `\\n` and `\\t` instead of real newlines.

                    Example (for illustration only): [ ["What is 2 + 2?", "1", "2", "3", "4", "d"], ... ]

                    Skill: {skill}
                    Proficiency (1-10): {proficiency}
        '''.strip()

    # fmt: off
    response_string = _call_gemini(gemini_prompt)

    response_text = (getattr(response_string, 'text', None) or str(response_string)).strip()

    response = response_text.strip("```json").strip("```")
    response_json = json.loads(response)

    return response_json