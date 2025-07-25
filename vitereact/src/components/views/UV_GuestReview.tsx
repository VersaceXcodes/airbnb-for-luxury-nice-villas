import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Booking, GuestReview, CreateGuestReviewInput } from "@/schema";
import { use_app_store } from '@/store/main';

// Explicit axios instance reused from global store
import { AxiosError } from 'axios';

const UV_GuestReview: React.FC = () => {
  // Small SVG Star component inlined to minimise size
  const SvgStar = ({ filled, color }: { filled: boolean; color: string }) => (
    <svg
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill={filled ? color : 'transparent'}
      stroke={color}
      className={`transition-all duration-200 cursor-pointer ${
        filled ? 'scale-110' : 'scale-100'
      }`}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const apiClient = use_app_store(state => state.api_client);
  const pushNotification = use_app_store(state => state.push_notification);

  // Local form state
  const [ratings, setRatings] = useState({
    accuracy: 0,
    cleanliness: 0,
    communication: 0,
    location: 0,
    value: 0,
  });
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false); // confirmation stamp

  // Fetch booking details
  const { data: booking, isLoading: loadingBooking } = useQuery<Booking, Error>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/bookings/${bookingId}`);
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  // Mutation to post the review
  const mutation = useMutation<GuestReview, AxiosError, CreateGuestReviewInput>({
    mutationFn: async variables => {
      const { data } = await apiClient.post('/reviews', variables);
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => navigate('/trips', { replace: true }), 1500);
    },
    onError: () => pushNotification({ type: 'error', title: 'Error', body: 'Failed to submit review' }),
  });



  const handleSubmit = useCallback(async () => {
    const payload: CreateGuestReviewInput = {
      booking_id: booking!.id,
      villa_id: booking!.villa_id,
      rating: Math.round((ratings.accuracy + ratings.cleanliness + ratings.communication + ratings.location + ratings.value) / 5),
      title: 'Guest Review',
      content,
    };
    mutation.mutate(payload);
  }, [booking, ratings, content, mutation]);

  // Guard against mismatched role while staying in render
  if (loadingBooking) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-rose-600 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const reviewKeys: Array<keyof typeof ratings> = [
    'accuracy',
    'cleanliness',
    'communication',
    'location',
    'value',
  ];

  const ready = reviewKeys.every(k => ratings[k] > 0) && content.trim().length >= 10 && files.length === 5;

  return (
    <>
      {/* MAIN CONTAINER */}
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 sm:p-8 relative">
          {submitted && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
              <div className="text-center">
                <div className="text-6xl">✅</div>
                <div className="mt-4 text-xl font-bold text-green-700">Review Confirmed</div>
              </div>
            </div>
          )}
          {/* VILLA PREVIEW */}
          <div className="flex mb-6">
            <div className="w-28 h-28 bg-gray-300 rounded flex-shrink-0">
              <img
                src={`https://picsum.photos/seed/${booking?.villa_id}/200`}
                alt="villa"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Villa {bookingId}</h1>
              <p className="text-sm text-gray-500">
                Stayed from {booking?.check_in} to {booking?.check_out}
              </p>
            </div>
          </div>

          {/* RATING GROUPS */}
          <div className="space-y-4">
            {reviewKeys.map(key => (
              <div key={key} className="flex justify-between items-center">
                <span className="capitalize font-medium">{key}</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(index => (
                    <div
                      key={index}
                      onClick={() => setRatings(r => ({ ...r, [key]: index }))}
                    >
                      <SvgStar
                        filled={index <= ratings[key]}
                        color={index <= ratings[key] ? '#ffd700' : '#d6d6d6'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* COMMENT */}
          <div className="mt-6">
            <label className="block mb-2 font-semibold">Share your experience</label>
            <textarea
              rows={4}
              maxLength={2000}
              className="w-full border border-gray-300 rounded p-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Tell us about your stay..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <p className="text-right text-sm text-gray-500">{content.length}/2000</p>
          </div>

          {/* PHOTO Uploader */}
          <div className="mt-6">
            <label className="block mb-2 font-semibold">Upload exactly 5 photos</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png"
              className="hidden"
              id="photo-upload"
              onChange={e => {
                const fileArray = Array.from(e.target.files ?? []);
                setFiles(fileArray.slice(0, 5));
              }}
            />
            <label
              htmlFor="photo-upload"
              className="block w-full text-center border-2 border-dashed border-gray-400 rounded p-4 cursor-pointer hover:border-rose-500"
            >
              Drag & drop files or browse
            </label>
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-5 gap-2">
                {files.map((f, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(f)}
                    alt="preview"
                    className="w-full h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
            {files.length !== 5 && (
              <p className="text-sm text-red-600 mt-2">
                {files.length}/5 – exactly 5 required
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <div className="mt-8 flex justify-end">
            <button
              disabled={!ready || mutation.isPending}
              className={`px-6 py-2 rounded font-semibold text-white ${
                ready ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gray-400'
              } disabled:opacity-60`}
              onClick={handleSubmit}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_GuestReview;