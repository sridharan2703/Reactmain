/**
 * @file DocumentsMain.jsx
 * @description
 * Top-level component showing folders for Employee and Dependents documents.
 * Expands to show spouse and children folders dynamically.
 * @version 1.0.0
 * @date 2025-11-06
 * @author Susmitha
 */

/**
 * @file            DocumentsMain.jsx
 * @description     Dynamic employee document viewer with folder navigation
 * @version         3.1.0
 * @date            2025-11-10
 * @author          Susmitha
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Folder, Description, ArrowBack, SearchOff } from "@mui/icons-material";
import DependentSectionCard from "src/components/ui/SideColorCard.js";
import Cookies from "js-cookie";
import axios from "axios";

const DocumentsMain = ({ selectedEmployeeId, color }) => {
  const [documentData, setDocumentData] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [path, setPath] = useState(["Documents"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fetch document data for the selected employee
   */
  useEffect(() => {
    if (selectedEmployeeId) fetchDocumentData(selectedEmployeeId);
  }, [selectedEmployeeId]);

  const fetchDocumentData = async (employeeId) => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("HRToken");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/getEmployeeDocuments`,
        { employeeid: employeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.Status === 200) {
        const data = response.data.Data;
        const structuredData = {
          name: "Root",
          folders: [
            {
              name: "Employee Documents",
              files: data.employeeDocuments || [],
              folders: [
                {
                  name: "Spouse",
                  files: data.spouseDocuments || [],
                },
                {
                  name: "Children",
                  folders:
                    (data.children || []).map((child) => ({
                      name: child.name || "Child",
                      files: child.documents || [],
                    })) || [],
                },
              ],
            },
          ],
        };

        setDocumentData(structuredData);
        setCurrentFolder(structuredData);
        setPath(["Documents"]);
      } else {
        setError("Failed to load documents");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching document data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate into a folder
   */
  const openFolder = (folderName) => {
    const folder = currentFolder?.folders?.find((f) => f.name === folderName);
    if (folder) {
      setCurrentFolder(folder);
      setPath([...path, folderName]);
    }
  };

  /**
   * Go back to the parent folder
   */
  const goBack = () => {
    if (path.length > 1) {
      const newPath = [...path];
      newPath.pop();
      let folder = documentData;
      for (let i = 1; i < newPath.length; i++) {
        folder = folder?.folders?.find((f) => f.name === newPath[i]);
      }

      setCurrentFolder(folder || documentData);
      setPath(newPath);
    }
  };

  /**
   * UI Rendering
   */
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 10,
          }}
        >
          <CircularProgress size={36} />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography
          color="error"
          align="center"
          sx={{ py: 8, fontWeight: 500 }}
        >
          {error}
        </Typography>
      );
    }

    if (
      !currentFolder ||
      (!currentFolder.folders?.length && !currentFolder.files?.length)
    ) {
      return (
        <Box
          sx={{
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <SearchOff sx={{ fontSize: 50, opacity: 0.6 }} />
          <Typography variant="body1" mt={1}>
            No Documents Found
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* Show Folders */}
        {currentFolder.folders?.map((folder) => (
          <Grid item xs={6} sm={4} md={3} key={folder.name}>
            <Box
              onClick={() => openFolder(folder.name)}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                p: 1.5,
                borderRadius: 2,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Folder sx={{ fontSize: 70, color: "goldenrod" }} />
              <Typography variant="body2" mt={1} fontWeight={500}>
                {folder.name}
              </Typography>
            </Box>
          </Grid>
        ))}

        {/* Show Files */}
        {currentFolder.files?.map((file) => (
          <Grid item xs={6} sm={4} md={3} key={file.name}>
            <Box
              sx={{
                textAlign: "center",
                p: 1.5,
                borderRadius: 2,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Description sx={{ fontSize: 70, color: "#757575" }} />
              <Typography variant="body2" mt={1}>
                {file.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box p={3}>
      <DependentSectionCard color={color}>
        {/* 🔹 Breadcrumb Header */}
        <Box display="flex" alignItems="center" mb={2}>
          {path.length > 1 && (
            <IconButton onClick={goBack}>
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={600}>
            {path.join(" / ")}
          </Typography>
        </Box>

        {renderContent()}
      </DependentSectionCard>
    </Box>
  );
};

export default DocumentsMain;
