
/**
 * @fileoverview Main Employee E-File component providing comprehensive employee data management.
 * Features dashboard navigation, section-based data display.
 * @module src/views/Menus/EFile
 * @author Rovita
 * @date 04/11/2025
 * @since 1.0.0
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Person,
  Image as ImageIcon,
  ExpandMore,
  Favorite,
} from "@mui/icons-material";
import { getDynamicColor } from "src/components/ui/Colors";
import DependentSectionCard from "src/components/ui/SideColorCard.js";

/**
 * Relationship icon mapping for different dependent types
 * @description Maps relationship types to appropriate Material-UI icons
 * Used for visual representation of dependent relationships
 */
export const relationshipIcons = {
  spouse: <Person />,
  son: <Person />,
  daughter: <Person />,
  father: <Person />,
  mother: <Person />,
};

/**
 * Determines document status based on document and photo values
 * @param {string} docValue - Document upload status value
 * @param {string} photoValue - Photo upload status value
 * @returns {string} Status description ('Doc & Photo', 'Doc', 'Photo', 'None')
 * @description Evaluates presence of documents and photos to determine overall status
 */
const getDocumentStatus = (docValue, photoValue) => {
  const hasDoc = docValue && docValue !== "N/A" && docValue !== "";
  const hasPhoto = photoValue && photoValue !== "N/A" && photoValue !== "";

  if (hasDoc && hasPhoto) return "Doc & Photo";
  if (hasDoc) return "Doc";
  if (hasPhoto) return "Photo";
  return "None";
};

/**
 * Extracts initials from a full name for avatar display
 * @param {string} name - Full name to extract initials from
 * @returns {string} Uppercase initials (e.g., "John Doe" → "JD")
 * @description Handles empty names and multiple word names gracefully
 */
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

/**
 * Formats insurance display value with proper labeling
 * @param {string} insuranceValue - Raw insurance value ('Yes' or other)
 * @returns {string} Formatted display text ('Opted In' or 'Not Opted')
 * @description Converts boolean-like values to user-friendly text
 */
const getInsuranceDisplay = (insuranceValue) => {
  return insuranceValue === "Yes" ? "Opted In" : "Not Opted";
};

/**
 * Formats Long Term Care (LTC) display value with proper labeling
 * @param {string} ltcValue - Raw LTC value ('Yes' or other)
 * @returns {string} Formatted display text ('Opted In' or 'Not Opted')
 * @description Converts boolean-like values to user-friendly text
 */
const getLTCDisplay = (ltcValue) => {
  return ltcValue === "Yes" ? "Opted In" : "Not Opted";
};

/**
 * Status Chip Component for displaying status with color coding
 * @param {Object} props
 * @param {string} props.status - Status value that determines color
 * @param {string} props.label - Display text for the chip
 * @description Displays status with appropriate color coding based on status value
 * Supports common status types: approved, pending, completed, active, etc.
 */
const StatusChip = ({ status, label }) => {
  /**
   * Determines color based on status value
   * @param {string} status - Status value to evaluate
   * @returns {string} HEX color code for the status
   */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
      case "active":
      case "processed":
      case "yes":
      case "permanent":
        return "#2e7d32"; // Green for positive/active status
      case "pending":
      case "under review":
        return "#ed6c02"; // Orange for pending status
      case "eligible":
        return "#1976d2"; // Blue for eligible status
      default:
        return "#757575"; // Gray for unknown/default status
    }
  };

  const color = getStatusColor(status);

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: `${color}20`, // 20% opacity background
        color: color,
        fontWeight: "600",
        border: `1px solid ${color}40`, // 40% opacity border
        fontSize: "0.7rem",
        height: 22,
      }}
    />
  );
};

/**
 * File Chip Component for document/photo status indicators
 * @param {Object} props
 * @param {string} props.label - Label text ('Doc' or 'Photo')
 * @description Compact chip for displaying file/document status
 * Used in document status display within dependent cards
 */
const FileChip = ({ label }) => (
  <Chip
    label={label}
    size="small"
    variant="outlined"
    sx={{
      height: 22,
      fontSize: "0.65rem",
      fontWeight: 500,
      "& .MuiChip-label": { px: 1 }, // Horizontal padding for label
    }}
  />
);

/**
 * Detail Item Component for consistent key-value pair display with dynamic sizing
 * @param {Object} props
 * @param {string} props.label - Label text for the detail
 * @param {string|ReactNode} props.value - Value to display (string or React component)
 * @param {number} props.maxWidth - Maximum width for the item (default: 280)
 * @param {boolean} props.allowWrap - Whether to allow text wrapping (default: false for most fields, true for addresses)
 * @param {number} props.minHeight - Minimum height for the item (default: 80)
 * @description Responsive component for displaying labeled information with dynamic sizing
 */
const DetailItem = ({
  label,
  value,
  maxWidth = 280,
  allowWrap = false,
  minHeight = 80,
}) => {
  const valueText = typeof value === "string" ? value : "";
  const needsDynamicHeight = allowWrap && valueText.length > 25;
  const isAddressField = label?.toLowerCase().includes("address");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : maxWidth,
        minWidth: isMobile ? "100%" : 200,
        height: needsDynamicHeight ? "auto" : minHeight,
        minHeight: isAddressField ? 100 : minHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        backgroundColor: "#f9fafb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        p: 2,
        overflow: "hidden",
        textAlign: "center", // Always center the container
        margin: "4px",
        flexShrink: 0,
      }}
    >
      {/* Label Section */}
      <Typography
        variant="caption"
        sx={{
          color: "#6b7280",
          fontWeight: 600,
          minHeight: 22,
          lineHeight: "22px",
          whiteSpace: "normal",
          overflow: "visible",
          textOverflow: "clip",
          width: "100%",
          mb: 1,
          textAlign: "center", // Always center labels
          wordBreak: "break-word",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label}
      </Typography>

      {/* Value Section - Always centered */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center", // Always center vertically
          justifyContent: "center", // Always center horizontally
          minHeight: isAddressField ? 60 : 30,
          overflow: "visible",
          flex: 1,
        }}
      >
        {value ? (
          typeof value === "string" ? (
            <Typography
              variant="body2"
              sx={{
                color: "#111827",
                fontWeight: 500,
                fontSize: "0.85rem",
                whiteSpace: allowWrap ? "pre-line" : "nowrap",
                overflow: allowWrap ? "visible" : "hidden",
                textOverflow: allowWrap ? "clip" : "ellipsis",
                width: "100%",
                textAlign: "center", // Always center text
                wordBreak: "break-word",
                lineHeight: 1.5,
                display: "block",
              }}
            >
              {value}
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {value}
            </Box>
          )
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "#9ca3af",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "0.85rem",
              textAlign: "center", // Always center N/A text
            }}
          >
            N/A
          </Typography>
        )}
      </Box>
    </Box>
  );
};
/**
 * Document Status Component for displaying document and photo upload status
 * @param {Object} props
 * @param {string} props.docValue - Document upload status
 * @param {string} props.photoValue - Photo upload status
 * @description Visual indicator showing which documents/photos are uploaded
 * Displays chips for documents and photos or "None" if neither exists
 */
const DocumentStatus = ({ docValue, photoValue }) => {
  const status = getDocumentStatus(docValue, photoValue);

  if (status === "None") {
    return (
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontSize: "0.7rem" }}
      >
        None
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {status.includes("Doc") && <FileChip label="Doc" />}
      {status.includes("Photo") && <FileChip label="Photo" />}
    </Box>
  );
};

/**
 * Table Field Component for structured data display in tables
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.value - Field value
 * @param {string} props.status - Optional status for chip display
 * @description Individual field component for table structures
 * Displays label-value pairs with optional status chip formatting
 */
const TableField = ({ label, value, status }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      p: 1,
      borderRadius: 1,
      bgcolor: "#f8f9fa",
      border: "1px solid #e9ecef",
      minHeight: 70, // consistent box height
      width: "100%", // make each field stretch equally
    }}
  >
    <Typography
      variant="caption"
      fontWeight="600"
      sx={{
        color: "text.secondary",
        fontSize: "0.75rem",
        display: "block",
        height: 20, // consistent label height
        lineHeight: "20px",
      }}
    >
      {label}
    </Typography>

    <Box
      sx={{
        height: 25, // fixed height for values
        display: "flex",
        alignItems: "center",
      }}
    >
      {status !== undefined ? (
        <StatusChip status={value === "Yes" ? "Yes" : "No"} label={value} />
      ) : (
        <Typography
          variant="body2"
          fontWeight="500"
          sx={{
            fontSize: "0.8rem",
            color: "text.primary",
            wordBreak: "break-word",
          }}
        >
          {value || "N/A"}
        </Typography>
      )}
    </Box>
  </Box>
);

/**
 * Nominee Grid Component for displaying multiple nominees in a responsive grid
 * @param {Object} props
 * @param {Array} props.nominees - Array of nominee objects
 * @description Responsive grid layout for nominee cards
 * Adapts between single column (mobile) and two columns (desktop)
 */
export const NomineeGrid = ({ nominees }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: 1,
        width: "100%",
      }}
    >
      {nominees.map((nominee, index) => (
        <NomineeCard key={index} nominee={nominee} color={nominee.color} />
      ))}
    </Box>
  );
};

/**
 * Nominee Card Component for individual nominee information display
 * @param {Object} props
 * @param {Object} props.nominee - Nominee data object
 * @param {string} props.color - Theme color for the card
 * @description Expandable card component for nominee information
 * Shows minimal info when collapsed, full details when expanded
 */
export const NomineeCard = ({ nominee, color }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Toggles expanded state for showing/hiding detailed information
   * @param {Event} e - Click event
   */
  const toggleExpand = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setExpanded(!expanded);
  };

  /**
   * Renders minimal information view for collapsed state
   * @returns {JSX.Element} Minimal info JSX
   */
  const renderMinimalInfo = () => (
    <Box sx={{ p: 2 }}>
      {/* --- Nominee Name (Title) --- */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="h6"
          fontWeight="700"
          sx={{
            fontSize: isMobile ? "0.9rem" : "1rem",
            mb: 2,
            mt: -2,
            textAlign: isMobile ? "left" : "left",
          }}
        >
          {
            nominee.fields?.find((f) =>
              ["title", "Name", "Nominee Name", "Full Name"].includes(
                f.label?.trim()
              )
            )?.value || "No Name"
          }
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* --- Nominee Details --- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: isMobile ? "nowrap" : "wrap",
          gap: 1,
          width: "100%",
          justifyContent: "space-around",
          alignItems: "flex-start",
        }}
      >
        <DetailItem
          label="Name"
          value={
            nominee.fields?.find((f) =>
              ["Name", "Nominee Name", "Full Name"].includes(f.label?.trim())
            )?.value || "N/A"
          }
        />

        <DetailItem
          label="Relationship"
          value={
            nominee.fields?.find((f) =>
              ["Relationship", "Relationship/Place", "Relation"].includes(
                f.label?.trim()
              )
            )?.value || "N/A"
          }
        />

        <DetailItem
          label="Date of Birth"
          value={
            nominee.fields?.find((f) =>
              ["Date of Birth", "DOB", "Date Of Birth"].includes(
                f.label?.trim()
              )
            )?.value || "N/A"
          }
        />

        <DetailItem
          label="Share Percentage"
          value={
            nominee.fields?.find((f) =>
              [
                "Share Percentage",
                "Percentage of Share",
                "Share %",
                "share_percentage",
              ].includes(f.label?.trim())
            )?.value || "N/A"
          }
        />
      </Box>

      {/* --- Mobile Expand/Collapse Button --- */}
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <Button
            onClick={toggleExpand}
            endIcon={
              <ExpandMore
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            }
            size="small"
            sx={{
              color: color,
              fontWeight: 600,
            }}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </Box>
      )}
    </Box>
  );

  /**
   * Renders detailed table structure for expanded state
   * @returns {JSX.Element} Table structure JSX
   */
  const renderTableStructure = () => {
    const fields = nominee.fields || [];

    return (
      <Box sx={{ p: 2, pt: 1 }}>
        <Divider sx={{ mb: 2 }} />
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            background: "transparent",
            maxHeight: 300,
            overflow: "auto",
            "& .MuiTableRow-root:last-child .MuiTableCell-root": {
              borderBottom: "none", // Remove border for last row
            },
            "&::-webkit-scrollbar": { width: 6, height: 6 }, // Custom scrollbar
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: 3,
            },
          }}
        >
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ py: 1, verticalAlign: "top" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fit, minmax(200px, 1fr))", // Responsive grid
                      gap: 1,
                    }}
                  >
                    {fields.map((field, index) => (
                      <TableField
                        key={index}
                        label={field.label}
                        value={field.value || "N/A"}
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <DependentSectionCard
      color={color}
      sx={{
        width: "100%",
        mb: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 8px 25px ${color}20`, // Hover glow effect
        },
      }}
    >
      <Box sx={{ cursor: "pointer" }}>
        {renderMinimalInfo()}
        <Collapse in={expanded}>{renderTableStructure()}</Collapse>
      </Box>
    </DependentSectionCard>
  );
};

/**
 * Main Dependent Card Component for displaying dependent information
 * @param {Object} props
 * @param {Object} props.dependent - Dependent data object
 * @param {string} props.viewType - Type of view ('professional', etc.)
 * @param {string} props.color - Theme color for the card
 * @description Expandable card component with minimal and detailed views
 * Handles responsive design and various dependent data fields
 */
export const DependentCard = ({
  dependent,
  viewType = "professional",
  color,
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const relationshipColor = color; // Use provided color
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Toggles expanded state for detailed view
   * @param {Event} e - Click event
   */
  const toggleExpand = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setExpanded(!expanded);
  };

  /**
   * Renders minimal information in collapsed state
   * @returns {JSX.Element} Minimal info JSX with profile and key details
   */
  const renderMinimalInfo = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        p: 2,
        gap: 2,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* Left Section - Profile and Basic Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          minWidth: isMobile ? "100%" : 200,
          flex: isMobile ? 0 : 1,
        }}
      >
        <Avatar
          sx={{
            width: isMobile ? 60 : 70,
            height: isMobile ? 60 : 70,
            bgcolor: relationshipColor,
            fontSize: isMobile ? "1.2rem" : "1.4rem",
            boxShadow: `0 4px 12px ${relationshipColor}40`, // Glow effect
            flexShrink: 0, // Prevent avatar from shrinking
          }}
          src={dependent.avatar} // Optional avatar image
        >
          {getInitials(dependent.dependent_name)} {/* Fallback to initials */}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              fontSize: isMobile ? "1rem" : "1.1rem",
              mb: 0.5,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            {dependent.dependent_name || "No Name"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <Chip
              icon={
                relationshipIcons[
                  dependent.dependent_relationship?.toLowerCase()
                ] || <Person />
              }
              label={dependent.dependent_relationship || "No Relationship"}
              size="small"
              sx={{
                bgcolor: `${relationshipColor}15`,
                color: relationshipColor,
                fontWeight: "600",
                fontSize: "0.8rem",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Details Section with Dynamic Sizing */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          gap: 1,
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          marginLeft: isMobile ? 0 : "50px",
          overflowX: isMobile ? "auto" : "visible",
        }}
      >
        <DetailItem label="Age" value={dependent.dependent_age || "N/A"} />
        <DetailItem
          label="Blood Group"
          value={dependent.dependent_blood_group || "N/A"}
        />
        <DetailItem label="DOB" value={dependent.dependent_dob || "N/A"} />
      </Box>

      {/* Desktop Expand Button */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 60,
          }}
        >
          <IconButton
            onClick={toggleExpand}
            size="small"
            sx={{
              color: relationshipColor,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)", // Rotate animation
              transition: "transform 0.3s ease",
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>
      )}

      {/* Mobile Expand Button */}
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <Button
            onClick={toggleExpand}
            endIcon={
              <ExpandMore
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            }
            size="small"
            sx={{
              color: relationshipColor,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: `${color}10`, // Add hover effect
              },
            }}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </Box>
      )}
    </Box>
  );

  /**
   * Renders detailed table structure with all dependent fields
   * @returns {JSX.Element} Table structure JSX with scrollable container
   */
  const renderTableStructure = () => {
    const fields = [
      { label: "Name", value: dependent.dependent_name },
      { label: "Relationship", value: dependent.dependent_relationship },
      { label: "Date of Birth", value: dependent.dependent_dob },
      { label: "Age", value: dependent.dependent_age },
      { label: "Gender", value: dependent.gender },
      { label: "Blood Group", value: dependent.dependent_blood_group },
      { label: "Marital Status", value: dependent.maritalstatus },
      { label: "Is Twins", value: dependent.is_twins },
      { label: "Mobile No", value: dependent.mobile || "N/A" },
      { label: "Email", value: dependent.email || "N/A" },
      { label: "Aadhar No", value: dependent.aadhar },
      { label: "Declaration", value: dependent.declaration },
      { label: "Employment Status", value: dependent.employmentstatus },
      {
        label: "Is Currently Dependent",
        value: dependent.is_currently_dependent,
      },
      { label: "Document Type", value: dependent.documenttype || "N/A" },
      { label: "Opting for Insurance", value: dependent.opting_for_insurance },
      { label: "Opting for LTC", value: dependent.opting_for_ltc },
      { label: "Is Person Disabled", value: dependent.is_person_disabled },
    ];
    if (dependent.is_person_disabled === "Yes") {
      fields.push(
        { label: "Nature of Disability", value: dependent.natureofdisability },
        {
          label: "Percentage of Disability",
          value: dependent.percentageofdisability || "N/A",
        }
      );
    }
    fields.push(
      {
        label: "Document Uploaded",
        value: dependent.uploaddoc ? "Yes" : "No",
        status: dependent.uploaddoc,
      },
      {
        label: "Photo Uploaded",
        value: dependent.uploadphoto ? "Yes" : "No",
        status: dependent.uploadphoto,
      }
    );

    return (
      <Box sx={{ p: 2, pt: 1 }}>
        <Divider sx={{ mb: 2 }} />

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            background: "transparent",
            maxHeight: 400, // Fixed height with scroll
            overflow: "auto",
            "& .MuiTableRow-root:last-child .MuiTableCell-root": {
              borderBottom: "none", // Remove bottom border for last row
            },
            "&::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: 4,
            },
          }}
        >
          <Table size="small" sx={{ minWidth: isMobile ? 600 : 800 }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ py: 1, verticalAlign: "top" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: 1.5,
                    }}
                  >
                    {fields.map((field, index) => (
                      <TableField
                        key={index}
                        label={field.label}
                        value={field.value || "N/A"}
                        status={field.status}
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <DependentSectionCard
      color={relationshipColor}
      sx={{
        width: "100%",
        mb: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 8px 25px ${relationshipColor}20`, // Hover glow
        },
      }}
    >
      <Box onClick={toggleExpand} sx={{ cursor: "pointer" }}>
        {renderMinimalInfo()}
        <Collapse in={expanded}>{renderTableStructure()}</Collapse>
      </Box>
    </DependentSectionCard>
  );
};

/**
 * Professional Dependent View for displaying multiple dependents
 * @param {Object} props
 * @param {Array} props.dependents - Array of dependent objects
 * @param {string} props.color - Theme color for the cards
 * @description Container component that renders multiple dependent cards
 * Handles empty state and iterates through dependents array
 */
export const ProfessionalDependentView = ({ dependents, color }) => {
  if (!dependents || dependents.length === 0) {
    return (
      <DependentSectionCard color={color}>
        <Typography variant="h6" textAlign="center" color="text.secondary">
          No dependent information available
        </Typography>
      </DependentSectionCard>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {dependents.map((dependent, index) => (
        <DependentCard
          key={dependent.id || index}
          dependent={dependent}
          viewType="professional"
          color={color}
        />
      ))}
    </Box>
  );
};

/**
 * View Toggle Buttons for switching between different view modes
 * @param {Object} props
 * @param {string} props.currentView - Currently active view
 * @param {Function} props.onViewChange - Callback for view change
 * @description Navigation component for switching between different display views
 * Currently configured for professional view only
 */
export const ViewToggleButtons = ({ currentView, onViewChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const views = [
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        flexWrap: isMobile ? "wrap" : "nowrap",
        mb: 2, // Add some margin bottom for spacing
      }}
    >
      {views.map((view) => (
        <Button
          key={view.key}
          variant={currentView === view.key ? "contained" : "outlined"}
          startIcon={view.icon}
          onClick={() => onViewChange(view.key)}
          size={isMobile ? "small" : "medium"}
          sx={{
            borderRadius: 2,
            textTransform: "none", // Preserve case
            fontWeight: 600,
            ...(currentView === view.key && {
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Elevated shadow for active state
            }),
          }}
        >
          {isMobile ? view.label.split(" ")[0] : view.label} // Short label on
          mobile
        </Button>
      ))}
    </Box>
  );
};

/**
 * Specialized Detail Item for address fields with optimal sizing
 * @param {Object} props
 * @param {string} props.label - Label text for the address field
 * @param {string} props.value - Address value to display
 * @param {number} props.maxWidth - Maximum width (default: 320)
 * @description Optimized for lengthy address content with automatic text wrapping
 */

/**
 * Container component for address fields with optimal layout
 * @param {Object} props
 * @param {Array} props.addresses - Array of address objects with label and value
 * @description Specialized container for address fields that uses wrapping layout
 */
export {
  DetailItem, // Make sure this is exported
};
