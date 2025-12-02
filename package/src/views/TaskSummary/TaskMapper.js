// TaskMapper.js

// --- Color Mappings ---
const statusColorMap = {
    'Completed': '#10b981', 'On Going': '#3b82f6', 'Saved as Draft': '#6b7280', 
    'Deleted': '#CD2C58', 'Cancelled': '#CD2C58', 'Pending': '#f59e0b', 'ongoing': '#3b82f6', 
};

export const priorityColorMap = {
    'critical': '#dc2626', 'high': '#ea580c', 'normal': '#2563eb',
};

// Helper function to create Assignee/Initiator object
const createAssignee = (name, role, department = 'N/A') => ({
    name: name || 'N/A', role: role || 'N/A', department: department || 'N/A',
});


/**
 * Transforms a single API task object into the structure expected by TaskCard.
 */
export const mapApiTaskToTaskCard = (apiTask) => {
    const statusDesc = apiTask.task_status_desc;
    const priorityDesc = (apiTask.priority_desc || 'normal').toLowerCase(); 
    const statusColor = statusColorMap[statusDesc] || statusColorMap[statusDesc.toLowerCase()] || '#6b7280'; 
    
    const assigneeName = apiTask.pending; 
    
    const elapsedDays = apiTask.elapsed_days !== undefined && apiTask.elapsed_days !== null 
                        ? `${apiTask.elapsed_days} Days` 
                        : 'N/A';
    
    const lastUpdateDate = apiTask.updated_on || undefined;

    return {
        // Essential IDs
        process_id: apiTask.process_id,
        task_id: apiTask.task_id, 
        
        // Order specific field - THIS IS WHERE THE VALUE COMES FROM
        // Ensure apiTask.OfficeOrderNo or another field is not the correct source
        order_no: apiTask.order_no || apiTask.OfficeOrderNo || apiTask.reference_no || null,
        
        // Fields for Card Display
        id: apiTask.task_id,
        title: apiTask.process_name,
        priority: priorityDesc, 
        status: statusDesc,
        statusColor: statusColor,
        bgColor: `${statusColor}15`, 
        borderColor: statusColor,
        initiated: apiTask.initiated_on,
        
        completedDate: lastUpdateDate, 
        deletedDate: lastUpdateDate, 
        
        employeeId: apiTask.employee_id,
        dateOfAppointment: apiTask.date_of_appointment,
        
        // Assignee/Initiator Objects
        assignee: createAssignee(assigneeName, 'N/A'), 
        initiator: createAssignee(apiTask.initiated_name, 'Initiator', 'N/A'),
        
        elapsed: elapsedDays, 
        rating: 5, 
    };
};

export const getStatusColorMap = () => statusColorMap;