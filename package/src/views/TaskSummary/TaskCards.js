/**
 * @fileoverview Compact cards component with API Integration
 * @module components/Tasksummarycards
 * @author Elakiya
 * @date 12/08/2025
 */

import React, { useState } from 'react';

// Helper function to get initials for the avatar
const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('');

// [Tooltip Component - Helper]
const Tooltip = ({ children, text }) => { 
  const [isVisible, setIsVisible] = useState(false);
  
  // Placeholder styles for Tooltip
  const tooltipStyles = {
    tooltipBox: {
      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
      backgroundColor: '#333', color: 'white', padding: '5px 8px', borderRadius: '4px',
      fontSize: '12px', whiteSpace: 'nowrap', zIndex: 10, marginTop: '8px', pointerEvents: 'none',
    },
    tooltipArrow: {
      position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
      width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
      borderBottom: '5px solid #333',
    }
  };
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={tooltipStyles.tooltipBox}>
          {text}
          <div style={tooltipStyles.tooltipArrow} />
        </div>
      )}
    </div>
  );
};

// [Placeholder Styles for TaskCards]
const baseCardStyles = {
    card: { 
        backgroundColor: 'white', borderRadius: '12px', padding: '15px', 
        marginBottom: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
        cursor: 'pointer', transition: 'all 0.2s ease', 
        borderLeft: '5px solid #ccc', // Placeholder, overridden later
        position: 'relative', overflow: 'hidden'
    },
    cardHover: { 
        transform: 'translateY(-3px)', 
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    },
    priorityBadge: { 
        position: 'absolute', top: '10px', right: '10px', 
        fontSize: '10px', fontWeight: '700', padding: '3px 8px', 
        borderRadius: '8px', opacity: 0.8,
    },
    title: { 
        fontSize: '14px', fontWeight: '700', color: '#1f2937', 
        margin: '0 0 5px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
    }, 
    contentArea: { 
        marginTop: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' 
    }, 
    infoRow: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '8px', fontSize: '12px' 
    }, 
    infoLabel: { 
        color: '#6b7280', fontWeight: '600' 
    },
    statusBadge: { 
        fontSize: '10px', fontWeight: '700', padding: '3px 8px', 
        borderRadius: '6px', 
    },
    avatar: { 
        width: '24px', height: '24px', borderRadius: '50%', 
        backgroundColor: '#6b7280', color: 'white', fontSize: '10px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontWeight: '700' 
    }, 
    assigneeInfo: { flex: 1, minWidth: 0 }, 
    assigneeName: { 
        fontSize: '12px', fontWeight: '600', color: '#374151', 
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
    }, 
    assigneeRole: { 
        fontSize: '10px', color: '#9ca3af', overflow: 'hidden', 
        textOverflow: 'ellipsis', whiteSpace: 'nowrap'
    },
    footer: { 
        borderTop: '1px solid #f3f4f6', paddingTop: '10px', 
        marginTop: '10px', display: 'flex', justifyContent: 'flex-start', 
        alignItems: 'center' 
    }, 
    rating: {},
};


const TaskCards = ({ task, getPriorityStyles, openDialog }) => {
  const priorityStyles = getPriorityStyles(task.priority);
  const [isHovered, setIsHovered] = useState(false);
  
  // Merge styles with dynamic values
  const cardStyles = { 
    ...baseCardStyles,
    card: { 
      ...baseCardStyles.card, 
      borderLeft: `5px solid ${task.borderColor || priorityStyles.color}`, 
    },
    cardHover: { 
      ...baseCardStyles.cardHover, 
      border: `1px solid ${priorityStyles.color}`, 
      borderLeft: `5px solid ${task.borderColor || priorityStyles.color}`, 
    },
    priorityBadge: { 
      ...baseCardStyles.priorityBadge, 
      ...priorityStyles, 
    },
    statusBadge: { 
      ...baseCardStyles.statusBadge, 
      backgroundColor: task.bgColor, 
      color: task.statusColor, 
    },
  };

  const renderRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ fontSize: '15px', color: rating >= i + 1 ? '#fbbf24' : '#d1d5db', }} >
        {rating >= i + 1 ? '★' : '☆'}
      </span>
    ));
  };

  const renderAssigneeLabel = (assignee) => {
    if (!assignee || !assignee.name || assignee.name === 'N/A') return <span style={{ color: '#CD2C58', fontSize: '13px', paddingTop: '2px' }}>N/A</span>;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div style={cardStyles.avatar}> {getInitials(assignee.name)} </div>
            <div style={cardStyles.assigneeInfo}>
                <div style={cardStyles.assigneeName}>{assignee.name}</div>
                {(assignee.role || assignee.department) ? (
                  <div style={cardStyles.assigneeRole}>
                    {assignee.role && assignee.role !== 'N/A' ? assignee.role : ''}
                    {(assignee.role && assignee.role !== 'N/A' && assignee.department && assignee.department !== 'N/A') ? ' • ' : ''}
                    {assignee.department && assignee.department !== 'N/A' ? assignee.department : ''}
                  </div>
                ) : null}
            </div>
        </div>
    );
  };

  const currentStatus = (task.status || '').toLowerCase();
  
  // Define ID for display
  // MODIFIED: Use a flag to check if order_no is present.
  const hasOrderNo = !!task.order_no; 
  const primaryId = hasOrderNo ? task.order_no : `Task #${task.id}`;
  const idLabel = hasOrderNo ? 'Ref No:' : 'Task ID:';
  
  // Handle long titles
  const fullTitle = `${task.title}`;
  const isTitleLong = fullTitle.length > 50; 
  const displayTitle = isTitleLong ? `${fullTitle.substring(0, 47)}...` : fullTitle;


  return (
    <div
      style={{ 
        ...cardStyles.card, 
        ...(isHovered ? cardStyles.cardHover : {}), 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openDialog(task)}
    >
      <div style={cardStyles.priorityBadge}>{task.priority.toUpperCase()}</div> 
      
      {/* 1. Title (Permission cum Relief) - as per original image location */}
      <h3 style={{...cardStyles.title, marginBottom: '5px', paddingRight: '60px'}}>
        {isTitleLong ? (
          <Tooltip text={fullTitle}>
            {displayTitle}
          </Tooltip>
        ) : (
          displayTitle
        )}
      </h3>
      
      {/* 2. Order/Ref No (Placed under Title) 
          MODIFIED: This block is now conditionally rendered based on hasOrderNo.
      */}
      {hasOrderNo && (
          <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500', margin: '0 0 12px 0' }}>
              {idLabel} <span style={{ color: '#374151', fontWeight: '600' }}>{primaryId}</span>
          </p>
      )}

      {/* 3. Details (Status, Initiated By, etc.) */}
      <div style={cardStyles.contentArea}>
        <div style={cardStyles.infoRow}>
          <span style={cardStyles.infoLabel}>Status:</span>
          <div style={cardStyles.statusBadge}><span>{task.status}</span></div>
        </div>

        <div style={cardStyles.infoRow}>
          <span style={cardStyles.infoLabel}>Initiated By:</span>
          {renderAssigneeLabel(task.initiator)}
        </div>
         <div style={cardStyles.infoRow}>
          <span style={cardStyles.infoLabel}>order_no:</span>
          {renderAssigneeLabel(task.order_no)}
        </div>
        
        {(currentStatus.includes('ongoing') || currentStatus.includes('pending')) && (
          <>
            <div style={cardStyles.infoRow}>
              <span style={cardStyles.infoLabel}>Pending With:</span>
              {renderAssigneeLabel(task.assignee)} 
            </div>
            <div style={cardStyles.infoRow}>
              <span style={cardStyles.infoLabel}>Elapsed:</span>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', paddingTop: '2px' }}>{task.elapsed}</span>
            </div>
          </>
        )}

        {currentStatus.includes('saved as draft') && (
          <div style={cardStyles.infoRow}>
            <span style={cardStyles.infoLabel}>Days Elapsed:</span>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', paddingTop: '2px' }}>{task.elapsed}</span>
          </div>
        )}

        {(currentStatus.includes('deleted') || currentStatus.includes('cancelled')) && (
          <div style={cardStyles.infoRow}>
            <span style={cardStyles.infoLabel}>Deleted On:</span>
            <span style={{ fontSize: '13px', color: '#CD2C58', fontWeight: '500', paddingTop: '2px'  }}>{task.deletedDate}</span>
          </div>
        )}

       {currentStatus.includes('complete') && ( 
          <div style={cardStyles.infoRow}>
            <span style={cardStyles.infoLabel}>Completed On:</span>
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '500', paddingTop: '2px' }}>{task.completedDate}</span>
          </div>
        )}
      </div>

      <div style={cardStyles.footer}>
        <div style={cardStyles.rating}>
          {renderRatingStars(task.rating)}
        </div>
      </div>
    </div>
  );
};

export default TaskCards;