/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Ensure this imports the correct tagTypes
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi"; // Ensure baseApi is correctly defined and exported

const experienceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createExperience: build.mutation({
      query: (data) => ({
        url: `/experience/create-experience`, // Ensure the URL is correct
        method: "POST",
        body: data, // Using 'body' for payload in RTK Query
      }),
      invalidatesTags: [tagTypes.experiences], // This assumes 'tagTypes.experiences' is defined in tagTypes
    }),

    getAllExperience: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/experience", // Ensure this URL is correct
        method: "GET",
        // 'params' is not needed here for RTK Query, just use 'arg' directly if no other query parameters are needed
        // However, if you're passing parameters, consider using 'params' option in fetchBaseQuery
      }),
      providesTags: [tagTypes.experiences], // Make sure this is correctly set
    }),

    getSingleExperience: build.query({
      query: (experienceId) => ({
        url: `/experience/${experienceId}`, // Ensure experienceId is passed correctly
        method: "GET",
      }),
      providesTags: [tagTypes.experiences], // Ensure this is provided for cache management
    }),

    updateExperience: build.mutation({
      query: ({ updateData, experienceId }) => ({
        url: `/experience/${experienceId}`, // Correctly use the experienceId in the URL
        method: "PATCH",
        body: updateData, // Send the updated data as the body
      }),
      invalidatesTags: [tagTypes.experiences], // Invalidates cache on update
    }),

    deleteExperience: build.mutation({
      query: (experienceId) => ({
        url: `/experience/${experienceId}`, // Correctly use the experienceId
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.experiences], // Invalidates cache on delete
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useGetAllExperienceQuery,
  useGetSingleExperienceQuery,
  useUpdateExperienceMutation,
} = experienceApi;
