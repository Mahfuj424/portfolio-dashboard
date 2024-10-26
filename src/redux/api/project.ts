/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Ensure this imports the correct tagTypes
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi"; // Ensure baseApi is correctly defined and exported

const projectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation({
      query: (data) => ({
        url: `/project/create-project`, // Ensure the URL is correct
        method: "POST",
        body: data, // Using 'body' for payload in RTK Query
      }),
      invalidatesTags: [tagTypes.projects], // This assumes 'tagTypes.projects' is defined in tagTypes
    }),

    getAllProject: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/project", // Ensure this URL is correct
        method: "GET",
        // 'params' is not needed here for RTK Query, just use 'arg' directly if no other query parameters are needed
        // However, if you're passing parameters, consider using 'params' option in fetchBaseQuery
      }),
      providesTags: [tagTypes.projects], // Make sure this is correctly set
    }),

    getSingleProject: build.query({
      query: (projectId) => ({
        url: `/project/${projectId}`, // Ensure projectId is passed correctly
        method: "GET",
      }),
      providesTags: [tagTypes.projects], // Ensure this is provided for cache management
    }),

    updateProject: build.mutation({
      query: ({ updateData, projectId }) => ({
        url: `/project/${projectId}`, // Correctly use the projectId in the URL
        method: "PATCH",
        body: updateData, // Send the updated data as the body
      }),
      invalidatesTags: [tagTypes.projects], // Invalidates cache on update
    }),

    deleteProject: build.mutation({
      query: (projectId) => ({
        url: `/project/${projectId}`, // Correctly use the projectId
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.projects], // Invalidates cache on delete
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetAllProjectQuery,
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} = projectApi;
