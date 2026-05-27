import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { useAddFeedback } from '../../hooks/useAddFeedback';
import { PATHS } from '../../routes/paths';
import FeedbackForm from './components/FeedbackForm';


export default function AddFeedbackPage() {
  const navigate = useNavigate();
  const { customers } = useCustomers({ sortBy: 'name', sortOrder: 'asc' });

  const {
    customerId, setCustomerId,
    rating, setRating,
    hoverRating, setHoverRating,
    comment, setComment,
    category, setCategory,
    error, setError,
    isSubmitting,
    handleSubmit,
  } = useAddFeedback();

  return (
    <FeedbackForm
      customers={customers}
      customerId={customerId}
      setCustomerId={setCustomerId}
      rating={rating}
      setRating={setRating}
      hoverRating={hoverRating}
      setHoverRating={setHoverRating}
      comment={comment}
      setComment={setComment}
      category={category}
      setCategory={setCategory}
      error={error}
      setError={setError}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onCancel={() => navigate(PATHS.CUSTOMERS)}
    />
  );
}
