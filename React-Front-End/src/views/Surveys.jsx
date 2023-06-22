import React from "react";
import { PageComponent } from "../components";
import { useStateContext } from "../context/ContexProvider";
import { SurveyListItem } from "../components/SurveyListItem";
import { PrimaryButton } from '../components/core/PrimaryButton';
import { PlusCircleIcon } from "@heroicons/react/24/outline";


export const Surveys = () => {
  const { surveys } = useStateContext();
  const onDeleteClick = () => {
    console.log(surveys);
  };
  return (
    <>
      <PageComponent
        title="Surveys"
        buttons={ (
          <PrimaryButton color="green" to="/surveys/create">
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Create New
          </PrimaryButton>
  )}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
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
