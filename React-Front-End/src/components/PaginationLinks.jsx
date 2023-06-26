import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

export const PaginationLinks = ({ meta, onPageClick }) => {
  function onClick(event, link) {
    console.log(link);
    event.preventDefault();
    if (!link.url) {
      return;
    }

    onPageClick(link);
  }

  return (
    <div className="flex items-center justify-between shadow-lg mt-4 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          onClick={(event)=> onClick(event, meta.links[0])}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          onClick={(event)=> onClick(event, meta.links[meta.links.length - 1])}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium"> </span> {meta.from} to
            <span className="font-medium"> {meta.to}</span> of{" "}
            <span className="font-medium">{meta.total}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}

            {meta?.links &&
              meta?.links?.map((link, index) => {
                return (
                  <a
                    href="#"
                    key={index}
                    onClick={(event) => onClick(event, link)}
                    aria-current="page"
                    className={`relative z-10 bg-gray-200 inline-flex items-center hover:bg-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                      index == 0 ? "rounded-l-md disabled" : ""
                    } ${
                      link?.active &&
                      "bg-indigo-400 text-red-400  hover:bg-indigo-300"
                    } ${index == 0 ? "rounded-l-md" : ""} ${
                      index == meta.links.length - 1 ? "rounded-r-md disabled:" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: link?.label }}
                  >
                    {/* {link?.label} */}
                  </a>
                );
              })}
          </nav>
        </div>
      </div>
    </div>
  );
};
