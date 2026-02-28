import Sidebar from "../components/Sidebar";
import MainContainer from "../components/MainContainer";
import Overlay from "../components/Overlay";
import ContentContainer from "../components/ContentContainer";

const HomePage = () => {
    return (
        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                HomePage (not implemented)
            </ContentContainer>
        </MainContainer>
    );
};

export default HomePage;