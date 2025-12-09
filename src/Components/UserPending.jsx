import { useState, useEffect } from 'react';
import { AuthFetch, useAuth } from './AuthContext';
import { X, Clock, FileText, AlertCircle } from 'lucide-react';
export default function UserPending() {
    const [pending, setPending] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState('');
    const { apiUrl } = useAuth();
    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await AuthFetch(`${apiUrl}/api/exercise-requests/my-pending`, {
                    method: 'GET',
                    headers: { 'content-type': 'application/json' },
                    credentials: 'include'
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message);
                }
                const val = await res.json();
                setPending(val);
            } catch (e) {
                setError(e.message);
            }


        }

        fetchPending();
    }, [])
    const handleCancel = async () => {
        try {
            const res = await AuthFetch(`${apiUrl}/api/exercise-requests/cancel`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error);
            }
            setCancellingId(pending.requestId);
            setPending(null);
        } catch (e) {
            setError(e.message);
        }
    }
    const getStatusDisplay = (status) => {
        const statusMap = {
            'PENDING': { text: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-50' },
            'APPROVED': { text: 'Approved', color: 'text-green-600', bgColor: 'bg-green-50' },
            'REJECTED': { text: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50' }
        };

        return statusMap[status] || { text: status, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    };
    if (!pending) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-16">
                        <Clock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Pending Requests</h2>
                        <p className="text-gray-600">You don't have any exercise requests awaiting review.</p>
                    </div>
                </div>
            </div>
        );
    }
    if (error) return <p>{error}</p>;

    const statusInfo = getStatusDisplay(pending.status)
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Pending Exercise Request</h1>
                    <p className="text-gray-600">Manage your submitted exercise request awaiting review.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{pending.name}</h3>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                                    <Clock className="w-4 h-4 mr-1" />
                                    {statusInfo.text}
                                </div>


                            </div>
                            <button
                                onClick={() => handleCancel()}
                                disabled={cancellingId === pending.requestId}
                                className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                                {cancellingId === pending.requestId ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Cancelling...</span>
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </>
                                )}
                            </button>

                        </div>
                        {pending.description && (
                            <div className="mt-4 w-full">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-h-[50vh] overflow-y-auto">
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pending.description }}>

                                    </p>
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    )
}