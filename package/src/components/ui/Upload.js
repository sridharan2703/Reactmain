/**
 * @fileoverview
 * Generic File Upload Component Suite
 * 
 * This file provides a set of reusable, easy-to-use file upload components using Material-UI:
 *  - FileUpload: A single file input with label, preview (for images), and validation states.
 *    Supports a `type` prop to handle photo vs. document uploads differently based on parent input.
 *  - MultiFileUpload: Multiple file inputs for selecting and managing several files.
 *  - ImageUpload: A specialized single image upload with automatic preview (wrapper for FileUpload with type='photo').
 *  - DocumentUpload: A single document upload with file type restrictions and name display (wrapper for FileUpload with type='document').
 * 
 * These components are styled using Material-UI for visual consistency and flexibility.
 * Supports drag-and-drop, file previews (images), removal, and error handling.
 * The `type` prop in FileUpload allows parents to specify 'photo' (images only, preview always), 
 * 'document' (docs only, no preview), or 'general' (any file, preview if image).
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Typography,
  Chip,
  IconButton,
  Paper,
  useTheme,
  styled,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Image as ImageIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';

/**
 * Styled drop zone for drag-and-drop functionality.
 */
const DropZone = styled(Paper)(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.grey[400]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: isDragOver ? theme.palette.action.hover : 'transparent',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

/**
 * ✅ Single File Upload Component
 * 
 * Displays a file input with optional label, preview (for images), error message, and helper text.
 * Supports drag-and-drop. Behavior changes based on `type` prop from parent:
 * - 'photo': Accepts images only, always shows preview.
 * - 'document': Accepts documents only, shows file name with icon, no preview.
 * - 'general': Accepts any file, preview if image, else file name.
 * Parent can pass separate onChange handlers for photo vs. document logic if needed.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.label] - The label text displayed above the upload area.
 * @param {File|null} [props.value] - The currently uploaded file (for controlled component).
 * @param {Function} props.onChange - Function called with the new File when a file is selected.
 * @param {string} [props.type='general'] - 'photo', 'document', or 'general' to handle diff upload behaviors.
 * @param {string} [props.accept] - Accepted file types (overridden by type if not provided).
 * @param {boolean} [props.error=false] - If true, shows error styling and helper text.
 * @param {string} [props.helperText] - Text shown below the input (e.g., error message or hint).
 * @param {boolean} [props.fullWidth=false] - Makes the component expand to full container width.
 * @param {boolean} [props.required=false] - Marks the upload as required.
 * @param {boolean} [props.disabled=false] - Disables the upload area.
 * @param {string} [props.className] - Additional CSS classes for customization.
 * @param {Object} [props.sx] - MUI sx prop for styling overrides.
 */
export const FileUpload = ({
  label,
  value,
  onChange,
  type = 'general',
  accept,
  error = false,
  helperText,
  fullWidth = false,
  required = false,
  disabled = false,
  className = '',
  sx,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Define accept types based on type prop from parent
  const acceptTypes = {
    photo: 'image/*',
    document: '.pdf,.doc,.docx,.txt',
    general: '*/*',
  };
  const effectiveAccept = accept || acceptTypes[type];

  // Determine if preview should be shown
  const shouldShowPreview = (file) => {
    if (type === 'document') return false;
    return file?.type.startsWith('image/');
  };

  // Separate handling for photo vs. document in preview logic
  const handleFileChange = (file) => {
    if (file && onChange) {
      onChange(file);
      if (shouldShowPreview(file)) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemove = () => {
    if (onChange) onChange(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (effectiveAccept === '*' || effectiveAccept.split(',').some(t => file.type.includes(t.trim().replace('*', ''))))) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const hasFile = value;
  const showPreview = hasFile && shouldShowPreview(value);

  // Get icon based on type
  const getFileIcon = () => {
    if (showPreview) return <ImageIcon />;
    if (type === 'document' && value?.name.toLowerCase().endsWith('.pdf')) return <PictureAsPdfIcon />;
    return <InsertDriveFileIcon />;
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      disabled={disabled}
      sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}
      className={className}
    >
      {label && (
        <InputLabel shrink>
          {label}
          {required && <sup style={{ color: 'red' }}>*</sup>}
        </InputLabel>
      )}

      <Box
        component="label"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={effectiveAccept}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        {hasFile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2 }}>
            {showPreview && (
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                sx={{ maxWidth: 200, maxHeight: 200, borderRadius: 1, objectFit: 'cover' }}
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getFileIcon()}
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                {value?.name || 'File selected'}
              </Typography>
            </Box>
            <IconButton onClick={handleRemove} size="small" disabled={disabled}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <DropZone isDragOver={isDragOver} elevation={isDragOver ? 2 : 0}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Drag & drop or click to upload
            </Typography>
            <Typography variant="caption" color="grey.500">
              {type === 'photo' ? 'Images' : type === 'document' ? 'Documents' : 'Any file'} supported
            </Typography>
          </DropZone>
        )}
      </Box>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

/**
 * ✅ Multi File Upload Component
 * 
 * Allows uploading multiple files with previews (for images) and individual removal.
 * Supports `type` prop for consistent behavior across files (e.g., only photos or documents).
 * Parent can use separate onChange for batch photo vs. document handling.
 *
 * Common use case: Attaching multiple documents or photos (e.g., gallery, attachments).
 *
 * @param {Object} props - Component props.
 * @param {File[]} [props.value=[]] - Array of currently uploaded files.
 * @param {Function} props.onChange - Called with the updated File[] array.
 * @param {string} [props.type='general'] - 'photo', 'document', or 'general' for diff behaviors.
 * @param {string} [props.accept] - Accepted file types (overridden by type).
 * @param {number} [props.maxFiles=5] - Maximum number of files allowed.
 * @param {boolean} [props.error=false] - Error state for the entire component.
 * @param {string} [props.helperText] - Helper or error text.
 * @param {boolean} [props.fullWidth=false] - Full width layout.
 * @param {boolean} [props.required=false] - Required indicator.
 * @param {boolean} [props.disabled=false] - Disabled state.
 * @param {Object} [props.sx] - MUI sx overrides.
 */
export const MultiFileUpload = ({
  value = [],
  onChange,
  type = 'general',
  accept,
  maxFiles = 5,
  error = false,
  helperText,
  fullWidth = false,
  required = false,
  disabled = false,
  sx,
}) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Define accept types based on type prop
  const acceptTypes = {
    photo: 'image/*',
    document: '.pdf,.doc,.docx,.txt',
    general: '*/*',
  };
  const effectiveAccept = accept || acceptTypes[type];

  // Determine if preview should be shown for a file
  const shouldShowPreview = (file) => {
    if (type === 'document') return false;
    return file?.type.startsWith('image/');
  };

  const handleFilesChange = (files) => {
    const newFiles = Array.from(files).filter(
      (file) => effectiveAccept === '*' || effectiveAccept.split(',').some(t => file.type.includes(t.trim().replace('*', '')))
    );
    const updatedFiles = [...value, ...newFiles].slice(0, maxFiles);
    if (onChange) onChange(updatedFiles);
  };

  const handleRemove = (indexToRemove) => {
    const updated = value.filter((_, index) => index !== indexToRemove);
    if (onChange) onChange(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesChange(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  useEffect(() => {
    const urls = value
      .map((file, index) => shouldShowPreview(file) ? URL.createObjectURL(file) : null)
      .filter(Boolean);
    setPreviewUrls(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [value, type]);

  const canUploadMore = value.length < maxFiles;

  // Get icon for each file
  const getFileIcon = (file, index) => {
    if (shouldShowPreview(file)) return <ImageIcon key={index} />;
    if (type === 'document' && file?.name.toLowerCase().endsWith('.pdf')) return <PictureAsPdfIcon key={index} />;
    return <InsertDriveFileIcon key={index} />;
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}>
      <Box
        component="label"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={effectiveAccept}
          multiple
          onChange={(e) => handleFilesChange(e.target.files)}
          disabled={disabled || !canUploadMore}
          style={{ display: 'none' }}
        />
        {value.length === 0 ? (
          <DropZone isDragOver={isDragOver} elevation={isDragOver ? 2 : 0}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Drag & drop or click to upload {maxFiles > 1 ? `up to ${maxFiles} files` : 'a file'}
            </Typography>
            <Typography variant="caption" color="grey.500">
              {type === 'photo' ? 'Images' : type === 'document' ? 'Documents' : 'Any file'} supported
            </Typography>
          </DropZone>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2 }}>
            {value.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                icon={getFileIcon(file, index)}
                onDelete={() => handleRemove(index)}
                color={error ? 'error' : 'default'}
                variant="outlined"
                size="small"
                sx={{ maxWidth: 200, overflow: 'hidden' }}
              />
            ))}
            {canUploadMore && (
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                Add More
              </Button>
            )}
          </Box>
        )}
      </Box>
      {value.length > 0 && previewUrls.length > 0 && type !== 'document' && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {previewUrls.map((url, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={url}
                sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemove(index)}
                sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'white' }}
                disabled={disabled}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
      {helperText && (
        <FormHelperText error={error} sx={{ mt: 1 }}>
          {helperText} {required && value.length === 0 && <sup style={{ color: 'red' }}>*</sup>}
        </FormHelperText>
      )}
    </Box>
  );
};

/**
 * ✅ Image Upload Component
 * 
 * Wrapper for FileUpload with type='photo' for photo-specific handling.
 * Parent can pass photo-specific onChange.
 *
 * @param {Object} props - Props passed to FileUpload.
 */
export const ImageUpload = (props) => <FileUpload type="photo" {...props} />;

/**
 * ✅ Document Upload Component
 * 
 * Wrapper for FileUpload with type='document' for document-specific handling (no preview).
 * Parent can pass document-specific onChange.
 *
 * @param {Object} props - Props passed to FileUpload.
 */
export const DocumentUpload = (props) => <FileUpload type="document" {...props} />;

/** ✅ Default export: The main FileUpload component */
export default FileUpload;