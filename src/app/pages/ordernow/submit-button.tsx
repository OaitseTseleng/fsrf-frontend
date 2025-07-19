'use client';

interface Props {
  isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: Props) {
  return (
    <button
      disabled={isSubmitting}
      type="submit"
      className="bg-amber-800 text-white px-6 py-3 rounded hover:bg-amber-700"
    >
      {isSubmitting ? 'Submitting...' : 'Place Order'}
    </button>
  );
}
