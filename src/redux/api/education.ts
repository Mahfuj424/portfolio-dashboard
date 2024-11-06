/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Ensure this imports the correct tagTypes
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi"; // Ensure baseApi is correctly defined and exported

const educationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createEducation: build.mutation({
      query: (data) => ({
        url: `/education/create-education`, // Ensure the URL is correct
        method: "POST",
        body: data, // Using 'body' for payload in RTK Query
      }),
      invalidatesTags: [tagTypes.educations], // This assumes 'tagTypes.educations' is defined in tagTypes
    }),

    getAllEducation: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/education", // Ensure this URL is correct
        method: "GET",
        // 'params' is not needed here for RTK Query, just use 'arg' directly if no other query parameters are needed
        // However, if you're passing parameters, consider using 'params' option in fetchBaseQuery
      }),
      providesTags: [tagTypes.educations], // Make sure this is correctly set
    }),

    getSingleEducation: build.query({
      query: (educationId) => ({
        url: `/education/${educationId}`, // Ensure educationId is passed correctly
        method: "GET",
      }),
      providesTags: [tagTypes.educations], // Ensure this is provided for cache management
    }),

    updateEducation: build.mutation({
      query: ({ updateData, educationId }) => ({
        url: `/education/${educationId}`, // Correctly use the educationId in the URL
        method: "PATCH",
        body: updateData, // Send the updated data as the body
      }),
      invalidatesTags: [tagTypes.educations], // Invalidates cache on update
    }),

    deleteEducation: build.mutation({
      query: (educationId) => ({
        url: `/education/${educationId}`, // Correctly use the educationId
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.educations], // Invalidates cache on delete
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useGetAllEducationQuery,
  useGetSingleEducationQuery,
  useUpdateEducationMutation,
} = educationApi;
