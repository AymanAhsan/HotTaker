import { useEffect } from "react";
import { useUser } from '../accounts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const {isAuthenticated, loading} = useUser();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: null
    }
  });

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  // Image preview handling
  const watchedImage = watch("image");
  useEffect(() => {
    if (watchedImage?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('imagePreview', reader.result);
      };
      reader.readAsDataURL(watchedImage[0]);
    }
  }, [watchedImage, setValue]);

  const onSubmit = async (data) => {
    try {
      const csrfResponse = await axios.get("/api/csrf/", {
        withCredentials: true
      });
      const csrfToken = csrfResponse.data.csrfToken;

      console.log('form data:', data)
      const postData = new FormData();
      postData.append("title", data.title);
      postData.append("description", data.description);
  
      if (data.image?.[0]) {
        postData.append("image", data.image[0]);
      }
      console.log('Making request to create post...');
      const response = await axios.post("/api/create-posts/", postData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true
      });
      if (response.data.success) {
        console.log("success")
        navigate(`/posts/${response.data.post.id}`);
      } else {
        console.log("Not successful L")
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
    });
  };
}

  return (
    <div className="card">
      <div className="card-header">
        <h2>Create New Post</h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit(onSubmit)} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="error">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <span className="error">{errors.description.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <div className="image-upload">
              <label className="upload-button">
                <span className="upload-icon">📁</span>
                Upload Image
                <input
                  type="file"
                  id="image"
                  className="hidden-input"
                  accept="image/*"
                  {...register("image")}
                />
              </label>
            </div>
          </div>

          {watch('imagePreview') && (
            <div className="image-preview">
              <img src={watch('imagePreview')} alt="Preview" />
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? (
              <span className="button-content">
                <span className="loading-spinner"></span>
                Creating Post...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;