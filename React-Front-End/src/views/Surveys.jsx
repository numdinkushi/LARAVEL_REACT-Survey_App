import React from "react";
import { PageComponent } from "../components";
import { useStateContext } from "../context/ContexProvider";
import { SurveyListItem } from "../components/SurveyListItem";

export const Surveys = () => {
  const { surveys } = useStateContext();
  const onDeleteClick = () => {
    console.log(surveys);
  };
  return (
    <>
      <PageComponent title="">
        <div className="grid gir-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {surveys.map((survey) => {
            return (
              <SurveyListItem
                survey={survey}
                key={survey?.id}
                onDeleteClick={onDeleteClick}
              />
            );
          })}
        </div>
      </PageComponent>
    </>
  );
};
