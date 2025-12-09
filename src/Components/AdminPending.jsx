import { useState, useEffect } from 'react';
import { AuthFetch, useAuth } from './AuthContext';
import { Check, X, Clock, FileText, AlertCircle, Edit3, User } from 'lucide-react';
export default function AdminPending() {
    const [pending, setPending] = useState([]);
    const [error, setError] = useState(null);
    const [reviewingId, setReviewingId] = useState(null);
    const [reviewForm, setReviewForm] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { apiUrl } = useAuth();
    useEffect(() => {

        const fetchPending = async () => {
            try {
                const res = await AuthFetch(`${apiUrl}/api/exercise-requests/admin/pending`, {
                    method: 'GET',
                    headers: { 'content-type': 'application/json' },
                    credentials: 'include'
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error);
                }
                const val = await res.json();
                setPending(val);
            } catch (e) {
                setError(e.message);
            }


        }

        fetchPending();
    }, [])
    const getStatusDisplay = (status) => {
        const statusMap = {
            'PENDING': { text: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-50' },
            'APPROVED': { text: 'Approved', color: 'text-green-600', bgColor: 'bg-green-50' },
            'REJECTED': { text: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50' }
        };

        return statusMap[status] || { text: status, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    };
    const startReview = (request) => {
        setReviewingId(request.requestId);
        setReviewForm({
            ...request
        });
    };
    const cancelReview = () => {
        setReviewingId(null);
        setReviewForm(null);
    };
    const totalPages = Math.ceil(pending.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = pending.slice(startIndex, endIndex);

    const goToPage = (page) => {
        setCurrentPage(page);
        setReviewingId(null); // Close any open review forms when changing pages
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setReviewingId(null);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setReviewingId(null);
        }
    };

    const submitReview = async (requestId) => {
        try {


            const res = await AuthFetch(`${apiUrl}/api/exercise-requests/admin/${requestId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(reviewForm)

            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
            }

            const updatedRequest = await res.json();
            const updatedPending = pending.map(request =>
                request.requestId === requestId ? updatedRequest : request
            );
            setPending(updatedPending);


            setReviewingId(null);
            setReviewForm({ status: '', reviewNotes: '' });
        } catch (e) {
            console.error('Error submitting review:', e);
            setError(e.message);
        }
    }
    if (error) return <p>{error}</p>;
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                        <User className="w-8 h-8 mr-3 text-amber-500" />
                        Admin: Review Exercise Requests
                    </h1>
                    <p className="text-gray-600">Review and approve or reject submitted exercise requests.</p>
                    {pending.length > 0 && (
                        <div className="mt-4 text-sm text-gray-500">
                            Showing {startIndex + 1}-{Math.min(endIndex, pending.length)} of {pending.length} requests
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {currentRequests.map((request) => {
                        const statusInfo = getStatusDisplay(request.status);
                        const isReviewing = reviewingId === request.requestId;

                        return (
                            <div key={request.requestId} className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{request.name}</h3>
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                                                <Clock className="w-4 h-4 mr-1" />
                                                {statusInfo.text}
                                            </div>
                                        </div>

                                        {!isReviewing ? (
                                            <button
                                                onClick={() => startReview(request)}
                                                className="ml-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                <span>Review</span>
                                            </button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => submitReview(request.requestId)}
                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Submit</span>
                                                </button>
                                                <button
                                                    onClick={cancelReview}
                                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Cancel</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <FileText className="w-4 h-4 mr-1 text-amber-500" />
                                                Description
                                            </h4>
                                            {request.description && (
                                                <div className="mt-4 w-full">
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-h-[50vh] overflow-y-auto">
                                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: request.description }}>

                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isReviewing ? (
                                            <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Review This Request</h4>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Status
                                                        </label>
                                                        <select
                                                            value={reviewForm.status}
                                                            onChange={(e) => setReviewForm(prev => ({ ...prev, status: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="APPROVED">Approved</option>
                                                            <option value="REJECTED">Rejected</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Review Notes
                                                        </label>
                                                        <textarea
                                                            value={reviewForm.reviewNotes || ''}
                                                            onChange={(e) => setReviewForm(prev => ({ ...prev, reviewNotes: e.target.value }))}
                                                            placeholder="Add notes about this review..."
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            request.reviewNotes && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                        <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />
                                                        Review Notes
                                                    </h4>
                                                    <p className="text-gray-600 leading-relaxed bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                                                        {request.reviewNotes}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {pending.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-4">
                        {/* Previous Button */}
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-xl bg-white border border-yellow-300 text-yellow-700 font-medium
                       hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-white disabled:hover:border-yellow-300 transition-all duration-200
                       shadow-sm hover:shadow-md"
                        >
                            ← Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md
                    ${currentPage === i + 1
                                            ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-lg'
                                            : 'bg-white border border-yellow-300 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-xl bg-white border border-yellow-300 text-yellow-700 font-medium
                       hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-white disabled:hover:border-yellow-300 transition-all duration-200
                       shadow-sm hover:shadow-md"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div >
    )
}