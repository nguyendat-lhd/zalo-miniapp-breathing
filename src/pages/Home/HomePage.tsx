import React from "react";
import { HomeHeader, Utinities, ListOA, NewsSection } from "@components";
import PageLayout from "@components/layout/PageLayout";
import { APP_UTINITIES } from "@constants/utinities";
import { useStore } from "@store";
import Contacts from "./Contacts";
import Procedures from "./Procedures";
import BreathingPractice from "@components/breaths/BreathingPractice";

const HomePage: React.FunctionComponent = () => {
    const [organization] = useStore(state => [
        state.organization,
        state.getOrganization,
    ]);

    return (
        <PageLayout
            id="home-page"
            customHeader={
                <HomeHeader
                    title="Hít thở đi!"
                    name={organization?.name || ""}
                />
            }
        >
            <BreathingPractice />
        </PageLayout>
    );
};

export default HomePage;
