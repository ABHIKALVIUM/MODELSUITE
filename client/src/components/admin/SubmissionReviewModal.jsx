import { useState } from 'react';
import { reviewSubmission } from '../../api/submissions';

const REVIEW_STATUS_CLASS = {
  Pending:  'status-badge-Submitted',
  Approved: 'status-badge-Approved',
  Rejected: 'status-badge-Rejected',
};

/* ── Confirmation Modal for destructive Reject action (Bug #26) ── */
const ConfirmRejectModal = ({ talentName, onConfirm, onCancel }) => (
  <div
    style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 400, padding: '24px',
    }}
    onClick={onCancel}
  >
    <div
      style={{
        background: '#0D0D0D', border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '14px', width: '100%', maxWidth: '360px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'modalIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
        fontFamily: 'Inter, sans-serif',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '20px 22px 0' }}>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#F0F0F0', margin: '0 0 8px' }}>Reject Submission?</p>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
          You are about to reject {talentName ? <strong style={{ color: '#E5E2E1' }}>{talentName}&apos;s</strong> : 'this'} submission. This action will mark it as Rejected.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', padding: '18px 22px 20px' }}>
        <button
          id="reject-cancel-btn"
          onClick={onCancel}
          style={{
            flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)', color: '#9CA3AF', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          Cancel
        </button>
        <button
          id="reject-confirm-btn"
          onClick={onConfirm}
          style={{
            flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.35)',
            background: 'rgba(239,68,68,0.12)', color: '#F87171', fontSize: '13px',
            fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          ✕ Reject
        </button>
      </div>
    </div>
  </div>
);

const SubmissionReviewModal = ({ submission, onClose, onReviewed, toast }) => {
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const handleReview = async (status) => {
    try {
      await reviewSubmission(submission._id, status);
      toast?.success(`Submission ${status.toLowerCase()} successfully`);
      onReviewed();
      onClose();
    } catch (err) {
      toast?.error(err.response?.data?.message || 'Review action failed');
    }
  };

  const task   = submission.taskId   || {};
  const talent = submission.talentId || {};

  return (
    <>
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[200] p-6"
        onClick={onClose}>
        <div className="bg-bg-card border border-border rounded-xl w-full max-w-lg shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-modal-in"
          onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <h2 className="text-[17px] font-semibold text-text-primary">Review Submission</h2>
            <button onClick={onClose}
              className="bg-transparent border-none text-text-muted text-base cursor-pointer px-2 py-1 rounded-md hover:bg-bg-hover hover:text-text-primary transition-all">
              ✕
            </button>
          </div>

          <div className="p-6 flex flex-col gap-5">

            {/* Task info */}
            <div className="bg-bg-surface rounded-lg px-4 py-3.5 border border-border">
              <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-faint mb-1.5">Task</p>
              <p className="text-[15px] font-semibold text-text-primary">{task.title || '—'}</p>
              <div className="flex items-center gap-3 mt-2">
                {task.dueDate && (
                  <span className="text-[12px] text-text-faint">Due: {task.dueDate}</span>
                )}
                
                {task.status && (
                  <span className={`inline-block px-2 py-[2px] rounded-full text-[11px] font-medium status-badge-${task.status}`}>
                    {task.status}
                  </span>
                )}
              </div>
            </div>

            {/* Talent info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full avatar-talent flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                {talent.name?.[0] ?? 'T'}
              </div>
              <div>
                <p className="text-[14px] font-medium text-text-primary">{talent.name || 'Unknown Talent'}</p>
                <p className="text-[12px] text-text-faint">{talent.email || '—'}</p>
              </div>
              <div className="ml-auto">
                <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${REVIEW_STATUS_CLASS[submission.reviewStatus] || 'status-badge-Submitted'}`}>
                  {submission.reviewStatus || 'Pending'}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-faint mb-2">Notes</p>
              {submission.notes ? (
                <p className="text-[14px] text-text-muted leading-relaxed bg-bg-surface rounded-lg px-4 py-3 border border-border">
                  {submission.notes}
                </p>
              ) : (
                <p className="text-[13px] text-text-faint italic">No notes provided.</p>
              )}
            </div>

            {/* File */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-faint mb-2">Submitted File</p>
              {submission.fileUrl ? (
                <a href={submission.fileUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 text-[13px] text-primary font-medium hover:text-secondary transition-colors">
                  <span className="text-base">📎</span>
                  
                  <span className="underline underline-offset-2 truncate">{submission.fileUrl}</span>
                  <span className="text-text-faint text-[11px] shrink-0">↗ open</span>
                </a>
              ) : (
                <p className="text-[13px] text-text-faint italic">No file attached.</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1 border-t border-border mt-1">
              <button onClick={onClose}
                className="flex-1 py-2.5 bg-bg-input text-text-muted border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-bg-hover hover:text-text-primary transition-all font-sans">
                Cancel
              </button>
              {/* Bug #26: Reject now triggers confirmation modal */}
              <button
                id="reject-submission-btn"
                onClick={() => setShowRejectConfirm(true)}
                className="flex-1 py-2.5 bg-danger/10 text-danger border border-danger/30 rounded-lg text-sm font-semibold cursor-pointer hover:bg-danger/20 transition-all font-sans">
                ✕ Reject
              </button>
              <button
                id="approve-submission-btn"
                onClick={() => handleReview('Approved')}
                className="flex-1 py-2.5 bg-success/10 text-success border border-success/30 rounded-lg text-sm font-semibold cursor-pointer hover:bg-success/20 transition-all font-sans">
                ✓ Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bug #26: Confirmation dialog before rejecting */}
      {showRejectConfirm && (
        <ConfirmRejectModal
          talentName={talent.name}
          onConfirm={() => { setShowRejectConfirm(false); handleReview('Rejected'); }}
          onCancel={() => setShowRejectConfirm(false)}
        />
      )}
    </>
  );
};

export default SubmissionReviewModal;
