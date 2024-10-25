/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Ensure this imports the correct tagTypes
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi"; // Ensure baseApi is correctly defined and exported

const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBlog: build.mutation({
      query: (data) => ({
        url: `/blog/create-blog`, // Ensure the URL is correct
        method: "POST",
        body: data, // Using 'body' for payload in RTK Query
      }),
      invalidatesTags: [tagTypes.blogs], // This assumes 'tagTypes.blogs' is defined in tagTypes
    }),

    getAllBlog: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/blog", // Ensure this URL is correct
        method: "GET",
        // 'params' is not needed here for RTK Query, just use 'arg' directly if no other query parameters are needed
        // However, if you're passing parameters, consider using 'params' option in fetchBaseQuery
      }),
      providesTags: [tagTypes.blogs], // Make sure this is correctly set
    }),

    getSingleBlog: build.query({
      query: (blogId) => ({
        url: `/blog/${blogId}`, // Ensure blogId is passed correctly
        method: "GET",
      }),
      providesTags: [tagTypes.blogs], // Ensure this is provided for cache management
    }),

    updateBlog: build.mutation({
      query: ({ updateData, blogId }) => ({
        url: `/blog/${blogId}`, // Correctly use the blogId in the URL
        method: "PATCH",
        body: updateData, // Send the updated data as the body
      }),
      invalidatesTags: [tagTypes.blogs], // Invalidates cache on update
    }),

    deleteBlog: build.mutation({
      query: (blogId) => ({
        url: `/blog/${blogId}`, // Correctly use the blogId
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blogs], // Invalidates cache on delete
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useGetAllBlogQuery,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
} = blogApi;
