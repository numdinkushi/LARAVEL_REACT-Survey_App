import React, { useEffect, useState } from "react";
import { PageComponent, PaginationLinks } from "../components";
import { useStateContext } from "../context/ContexProvider";
import { SurveyListItem } from "../components/SurveyListItem";
import { PrimaryButton } from "../components/core/PrimaryButton";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import axiosClient from "../axios";
import { useNavigate } from "react-router-dom";

export const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({});
  const navigate = useNavigate();
  const { toast, showToast } = useStateContext();

  const onDeleteClick = (id) => {
    if(window.confirm("Are you sure you want to deletet this survey?")){
      axiosClient.delete(`/survey/${id}`)
      .then(()=>{
        getSurveys();
        showToast("Survey successfully deleted.");
      })
    }
  };

  const onPageClick = (link) => {
    console.log('clicked')
      getSurveys(link.url);
  }

  const getSurveys = async (url) => {
    url = url || '/survey'
    try {
      setLoading(true);
      const result = await axiosClient.get(url);
      if (result.data) {
        console.log(result);
        setSurveys(result.data.data);
        setMeta(result.data.meta);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSurveys();
  }, []);

  return (
    <>
      <PageComponent
        title="Surveys"
        buttons={
          <PrimaryButton color="green" to="/surveys/create">
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Create New
          </PrimaryButton>
        }
      >
        {loading && <div className="tex-lg tex-center"> ...loading </div>}
        {!loading && (
          <div>
            {surveys.length === 0 && (
            <div className="py-8 text-center text-gray-700">
              You don't have surveys created
            </div>
          )}
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
            {surveys.length > 0 && ( <PaginationLinks meta={meta} onPageClick={onPageClick} /> )}
          </div>
        )}
      </PageComponent>
    </>
  );
};
