import React, { useState } from "react";
import { Box, Typography, Grid, IconButton, Paper } from "@mui/material";
import { ArrowBack, Folder, Description } from "@mui/icons-material";
import DependentSectionCard from "src/components/ui/SideColorCard.js";

/**
 * Dynamic Document Browser Component
 * @description A reusable file browser component that can display any folder structure
 * @param {Object} props
 * @param {Object} props.documentStructure - The folder structure to display
 * @param {string} props.rootLabel - Root label (default: "Documents")
 * @param {string} props.folderColor - Color for folder icons (default: "#ffcc33")
 * @param {function} props.onFileClick - Callback when a file is clicked
 * @param {function} props.onFolderClick - Callback when a folder is clicked
 * @param {boolean} props.showBackButton - Whether to show back button (default: true)
 * @param {Object} props.sx - Additional styles
 */
const DynamicDocumentBrowser = ({
  documentStructure = null,
  rootLabel = "Documents",
  folderColor = "#ffcc33",
  onFileClick = null,
  onFolderClick = null,
  showBackButton = true,
  sx = {},
}) => {
  const [currentFolder, setCurrentFolder] = useState({ root: true });
  const [path, setPath] = useState([rootLabel]);
  const defaultStructure = {
    name: "No Documents",
    files: [],
    folders: [],
  };

  const structure = documentStructure || defaultStructure;
  const openRootFolder = () => {
    if (structure.folders?.length > 0 || structure.files?.length > 0) {
      setCurrentFolder(structure);
      setPath([rootLabel, structure.name]);

      if (onFolderClick) {
        onFolderClick(structure);
      }
    }
  };
  const openFolder = (folder) => {
    setCurrentFolder(folder);
    setPath([...path, folder.name]);

    if (onFolderClick) {
      onFolderClick(folder);
    }
  };
  const goBack = () => {
    if (path.length > 1) {
      const newPath = [...path];
      newPath.pop();

      if (newPath.length === 1) {
        setCurrentFolder({ root: true });
      } else if (newPath[newPath.length - 1] === structure.name) {
        setCurrentFolder(structure);
      } else {
        setCurrentFolder(structure);
      }
      setPath(newPath);
    }
  };
  const handleFileClick = (file) => {
    if (onFileClick) {
      onFileClick(file);
    }
  };
  const handleFolderClick = (folder) => {
    if (onFolderClick) {
      onFolderClick(folder);
    }
  };

  return (
    <Box sx={sx}>
      <DependentSectionCard>
        {/* Breadcrumb + Back button */}
        <Box display="flex" alignItems="center" mb={2}>
          {showBackButton && path.length > 1 && (
            <IconButton onClick={goBack} size="small" sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="subtitle1" fontWeight={600}>
            {path.join(" / ")}
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={2}>
          {/* Root view - show main folder if it has content */}
          {currentFolder.root &&
            (structure.folders?.length > 0 || structure.files?.length > 0) && (
              <Grid item xs={6} sm={4} md={3} lg={2.4}>
                <Paper
                  elevation={1}
                  onClick={openRootFolder}
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.05)",
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Folder sx={{ fontSize: 60, color: folderColor }} />
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      fontWeight: 500,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    {structure.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {structure.folders?.length || 0} folders,{" "}
                    {structure.files?.length || 0} files
                  </Typography>
                </Paper>
              </Grid>
            )}

          {/* No content message */}
          {currentFolder.root &&
            !structure.folders?.length &&
            !structure.files?.length && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Description
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No documents available
                  </Typography>
                </Box>
              </Grid>
            )}

          {/* Subfolders */}
          {!currentFolder.root &&
            currentFolder.folders?.map((folder, index) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                lg={2.4}
                key={folder.name || index}
              >
                <Paper
                  elevation={1}
                  onClick={() => {
                    openFolder(folder);
                    handleFolderClick(folder);
                  }}
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.05)",
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Folder sx={{ fontSize: 60, color: folderColor }} />
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      fontWeight: 500,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    {folder.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {folder.files?.length || 0} files
                  </Typography>
                </Paper>
              </Grid>
            ))}

          {/* Files */}
          {!currentFolder.root &&
            currentFolder.files?.map((file, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={file.name || index}>
                <Paper
                  elevation={1}
                  onClick={() => handleFileClick(file)}
                  sx={{
                    textAlign: "center",
                    cursor: onFileClick ? "pointer" : "default",
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: onFileClick
                        ? "rgba(0,0,0,0.05)"
                        : "transparent",
                      transform: onFileClick ? "translateY(-2px)" : "none",
                      boxShadow: onFileClick ? 3 : 1,
                    },
                  }}
                >
                  <Description sx={{ fontSize: 60, color: "#9e9e9e" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    {file.name}
                  </Typography>
                  {file.type && (
                    <Typography variant="caption" color="text.secondary">
                      {file.type}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}

          {/* Empty folder message */}
          {!currentFolder.root &&
            !currentFolder.folders?.length &&
            !currentFolder.files?.length && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Folder
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    This folder is empty
                  </Typography>
                </Box>
              </Grid>
            )}
        </Grid>
      </DependentSectionCard>
    </Box>
  );
};

export default DynamicDocumentBrowser;
