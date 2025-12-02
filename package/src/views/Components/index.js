/**
 * @fileoverview A showcase page demonstrating usage of various UI components.
 * Includes standard and advanced components like Searchable Dropdowns.
 * @module src/components/UIShowcase
 * @author Rakshana
 * @date 14/09/2025
 * @since 1.2.0
 */

import React, { useState } from "react";
import {Paper} from "@mui/material"; 
import Alerts from "src/components/ui/Alerts.js";
import Button from "src/components/ui/Button";
import Card from "src/components/ui/Cards";
import TextArea from "src/components/ui/TextArea";
import Pagination from "src/components/ui/Pagination";
import PriorityIcon from "src/components/ui/PriorityIcon";
import Avatar from "src/components/ui/Avatar";
import DialogBox from "src/components/ui/DialogBox";
import Input from "src/components/ui/Input";
import Dropdown from "src/components/ui/Dropdown";
import Checkbox from "src/components/ui/Checkbox";
import Badge from "src/components/ui/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { FaInfoCircle, FaHistory, FaStar } from "react-icons/fa";
const countryOptions = [
  { value: "AF", label: "Afghanistan" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "IN", label: "India" },
  { value: "BR", label: "Brazil" },
  { value: "CN", label: "China" },
  { value: "ZA", label: "South Africa" },
];

const languageOptions = [
  { value: "js", label: "JavaScript" },
  { value: "py", label: "Python" },
  { value: "rb", label: "Ruby" },
  { value: "go", label: "Go" },
];
const groupedOptions = [
  { value: "c", label: "C", group: "Low Level" },
  { value: "cpp", label: "C++", group: "Low Level" },
  { value: "js", label: "JavaScript", group: "High Level" },
  { value: "py", label: "Python", group: "High Level" },
];

/**
 * Main component to display all UI elements in a visually organized showcase.
 */
const UIShowcase = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("password123");
  const [searchValue, setSearchValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [dobValue, setDobValue] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [keywordValue, setKeywordValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("option-2");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGrouped, setSelectedGrouped] = useState(null);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [basicPage, setBasicPage] = useState(1);
  const [minimalPage, setMinimalPage] = useState(1);
  const [ellipsisPage, setEllipsisPage] = useState(1);
  const [iconsPage, setIconsPage] = useState(1);
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);

  const dropdownOptions = [
    { value: "option-1", label: "Option 1" },
    { value: "option-2", label: "Option 2" },
    { value: "option-3", label: "Option 3" },
  ];

  const planOptions = [
    { value: "", label: "Select a plan..." },
    { value: "basic", label: "Basic Plan" },
    { value: "premium", label: "Premium Plan" },
  ];

  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      style={{
        padding: "32px",
        height: "90vh",
        overflowY: "auto",
      }}
    >
      {/* --- Alerts & Buttons Section --- */}
      <section style={{ marginBottom: "48px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}
        >
          Alerts
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Alerts
              type="success"
              variant="filled"
              message="Operation successful!"
            />
            <Alerts
              type="error"
              variant="filled"
              message="Error - Something went wrong!"
            />
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Alerts
              type="warning"
              variant="outlined"
              message="This is a warning!"
            />
            <Alerts
              type="info"
              variant="outlined"
              message="Here is some information!"
            />
          </div>
        </div>
      </section>

      {/* <section style={{ marginBottom: "48px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}
        >
          Buttons
        </h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Button variant="primary" styleType="filled" size="lg">
            {" "}
            Submitting
          </Button>
          <Button
            variant="secondary"
            styleType="filled"
            size="sm"
            isDownloading
          >
            Downloading
          </Button>
          <Button variant="secondary" styleType="filled" size="sm" isLoading>
            Loading
          </Button>
          <Button variant="primary" styleType="light" disabled>
            Disabled
          </Button>
          <Button variant="secondary" styleType="outlined">
            Secondary
          </Button>
          <Button variant="success" styleType="light">
            Success
          </Button>
          <Button variant="danger" styleType="filled">
            {" "}
            Delete{" "}
          </Button>
          <Button variant="warning" styleType="outlined">
            Warning
          </Button>
          <Button variant="info" styleType="light">
            Info
          </Button>
        </div>
      </section> */}
<Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: "100%",
             p: 5,
             borderRadius: 6,
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              boxShadow: "0 8px 32px rgba(25, 118, 210, 0.15)",
              overflow: "hidden",
            }}
          >
  <section style={{ marginBottom: "48px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}
        >
          Buttons
        </h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Button variant="primary" styleType="filled" size="lg">
            {" "}
            Submitting
          </Button>
          <Button
            variant="secondary"
            styleType="filled"
            size="sm"
            isDownloading
          >
            Downloading
          </Button>
          <Button variant="secondary" styleType="filled" size="sm" isLoading>
            Loading
          </Button>
          <Button variant="primary" styleType="light" disabled>
            Disabled
          </Button>
          <Button variant="secondary" styleType="outlined">
            Secondary
          </Button>
          <Button variant="success" styleType="light">
            Success
          </Button>
          <Button variant="danger" styleType="filled">
            {" "}
            Delete{" "}
          </Button>
          <Button variant="warning" styleType="outlined">
            Warning
          </Button>
          <Button variant="info" styleType="light">
            Info
          </Button>
        </div>
      </section>
</Paper>

      <section style={{ marginBottom: "48px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}
        >
          Cards
        </h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Card
            title="Default Card"
            description="This is a normal card with shadow."
            imageUrl="https://asset.uinjkt.ac.id/uploads/nrVDCWWX/2024/03/ai-pattern.png"
            variant="filled"
          />
          <Card
            title="Outlined Card"
            description="This card uses border instead of shadow."
            variant="outlined"
          />
          <Card
            title="Hoverable Card"
            description="This card increases shadow on hover."
            variant="hoverable"
          />
          <Card
            title="Horizontal Card"
            description="This card displays image on the right."
            imageUrl="https://asset.uinjkt.ac.id/uploads/nrVDCWWX/2024/03/ai-pattern.png"
            variant="horizontal"
          />
          <Card
            title="Card with Badge"
            description="This card has a badge above the title."
            badge="Active"
            badgeType="success"
          />
          <Card
            tabs={[
              {
                label: "Description",
                icon: <FaInfoCircle />,
                content:
                  "The idea is to use :target pseudo class to show tabs, use anchors with fragment identifiers to switch between them..",
              },
              {
                label: "History",
                icon: <FaHistory />,
                content: (
                  <ol style={{ margin: 0, paddingLeft: "20px" }}>
                    <li>Show only the last tab.</li>
                    <li>
                      If <code>:target</code> matches a tab, show it and hide
                      all following siblings.
                    </li>
                    <li>
                      Matches a tab, show it and hide all following siblings.
                    </li>
                  </ol>
                ),
              },
              {
                label: "Reviews",
                icon: <FaStar />,
                content:
                  "The idea is to use :target pseudo class to show tabs, use anchors with fragment identifiers to switch between them..",
              },
            ]}
          />
          <Card
            title="Card with Footer"
            description="This card has footer actions."
            withFooter
          />
        </div>
      </section>

      {/* --- Input Fields Section --- */}
      <section style={{ marginBottom: "48px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}
        >
          Input Fields
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "48px",
          }}
        >
          {/* -------- LEFT COLUMN -------- */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "500",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "8px",
              }}
            >
              Standard Inputs
            </h3>

            {/* Username */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Username
              </label>
              <Input
                placeholder="Enter your username"
                value={inputValue}
                onChange={setInputValue}
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Password (toggle)
              </label>
              <Input
                isPassword
                placeholder="Enter your password"
                value={passwordValue}
                onChange={setPasswordValue}
              />
            </div>

            {/* Search Input */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Search
              </label>
              <Input
                isSearch
                placeholder="Search here..."
                value={searchValue}
                onChange={setSearchValue}
              />
            </div>

            {/* Textarea */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                About You
              </label>
              <Input
                isTextarea
                placeholder="Write something..."
                value={bioValue}
                onChange={setBioValue}
              />
            </div>
          </div>

          {/* -------- RIGHT COLUMN -------- */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "500",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "8px",
              }}
            >
              Input States & Variations
            </h3>

            {/* Error State */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Input with Error
              </label>
              <Input
                placeholder="Enter your email"
                value={emailValue}
                onChange={setEmailValue}
                error="Please enter a valid email address."
              />
            </div>

            {/* Disabled Input */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Disabled Input
              </label>
              <Input placeholder="Disabled input" value="" disabled />
            </div>

            {/* Date Input */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Date of Birth
              </label>
              <Input type="date" value={dobValue} onChange={setDobValue} />
            </div>

            {/* Prefix & Suffix */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Amount (with prefix & suffix)
              </label>
              <Input
                prefix="₹"
                suffix=".00"
                placeholder="Enter amount"
                value={amountValue}
                onChange={setAmountValue}
              />
            </div>

            {/* Clearable Input */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Clearable Input
              </label>
              <Input
                isClearable
                placeholder="Type something..."
                value={keywordValue}
                onChange={setKeywordValue}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- UPDATED Dropdown Section --- */}
      <section style={{ marginBottom: "48px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}
        >
          Dropdowns
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "48px",
          }}
        >
          {/* -------- LEFT COLUMN -------- */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "500",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "8px",
              }}
            >
              Standard & Advanced
            </h3>

            {/* Standard Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Standard Dropdown
              </label>
              <Dropdown
                options={dropdownOptions}
                value={selectedCategory}
                onChange={(option) => setSelectedCategory(option)} // ✅ FIXED
              />
            </div>

            {/* Searchable Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Searchable Country Dropdown
              </label>
              <Dropdown
                isSearchable
                options={countryOptions}
                value={selectedCountry}
                onChange={(option) => setSelectedCountry(option)}
                placeholder="Search for a country..."
              />
            </div>

            {/* Multi-Select Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Multi-Select Languages
              </label>
              <Dropdown
                isMulti
                isSearchable
                options={languageOptions}
                value={selectedLanguages}
                onChange={(options) => setSelectedLanguages(options)}
                placeholder="Select languages..."
              />
            </div>

            {/* Grouped Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Grouped Dropdown
              </label>
              <Dropdown
                isGrouped
                isSearchable
                options={groupedOptions}
                value={selectedGrouped}
                onChange={(option) => setSelectedGrouped(option)}
                placeholder="Choose a language..."
              />
            </div>

            {/* Custom Render Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Custom Rendered Options
              </label>
              <Dropdown
                isSearchable
                options={[
                  { value: "us", label: "United States", icon: "🇺🇸" },
                  { value: "in", label: "India", icon: "🇮🇳" },
                ]}
                value={selectedCountryFlag}
                onChange={(option) => setSelectedCountryFlag(option)}
                renderOption={(option, isSelected) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                    {isSelected && <span>✔</span>}
                  </div>
                )}
                placeholder="Pick a country..."
              />
            </div>
          </div>

          {/* -------- RIGHT COLUMN -------- */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "500",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "8px",
              }}
            >
              Dropdown States
            </h3>

            {/* Dropdown with Error */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Dropdown with Error
              </label>
              <Dropdown
                options={planOptions}
                value={selectedPlan}
                onChange={(option) => setSelectedPlan(option)} // ✅ FIXED
                error="This field is required."
              />
            </div>

            {/* Disabled Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Disabled Dropdown
              </label>
              <Dropdown options={dropdownOptions} disabled />
            </div>

            {/* Async Dropdown */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Async Dropdown (Users)
              </label>
              <Dropdown
                isSearchable
                asyncLoadOptions={async () => {
                  const res = await fetch(
                    "https://jsonplaceholder.typicode.com/users"
                  );
                  const data = await res.json();
                  return data.map((u) => ({ value: u.id, label: u.name }));
                }}
                value={selectedUser}
                onChange={(option) => setSelectedUser(option)}
                placeholder="Search for a user..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- Other Sections --- */}
      <section style={{ marginBottom: "48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Checkboxes
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Checkbox
                label="Accept terms"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <Checkbox label="Disabled checkbox" disabled />
            </div>
          </div>
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Badges
            </h2>
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Badge color="green" size="sm" variant="filled">
                Success
              </Badge>
              <Badge color="red" size="lg" variant="outline">
                Error
              </Badge>
              <Badge color="blue" size="md" variant="filled">
                Info
              </Badge>
              <Badge color="yellow" size="sm" variant="outline">
                Warning
              </Badge>
              <Badge badgeContent={4} color="red">
                <MailIcon />
              </Badge>
            </div>
          </div>
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Priority Icons
            </h2>
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span>
                <PriorityIcon level="high" /> High
              </span>
              <span>
                <PriorityIcon level="medium" /> Medium
              </span>
              <span>
                <PriorityIcon level="low" /> Low
              </span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}
        >
          Pagination
        </h2>

        <h5>Basic Pagination</h5>
        <Pagination
          totalPages={5}
          currentPage={basicPage}
          onPageChange={setBasicPage}
          variant="basic"
        />

        <h5>Minimal Pagination</h5>
        <Pagination
          totalPages={10}
          currentPage={minimalPage}
          onPageChange={setMinimalPage}
          variant="minimal"
        />

        <h5>Ellipsis Pagination</h5>
        <Pagination
          totalPages={15}
          currentPage={ellipsisPage}
          onPageChange={setEllipsisPage}
          variant="ellipsis"
        />

        <h5>Icon-based Pagination</h5>
        <Pagination
          totalPages={8}
          currentPage={iconsPage}
          onPageChange={setIconsPage}
          variant="icons"
        />
      </section>

      <section style={{ paddingBottom: "32px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}
        >
          Dialog Box
        </h2>
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          Open Dialog
        </Button>
        <DialogBox
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Confirm Action"
        >
          <p>This action cannot be undone. Are you sure you want to proceed?</p>
        </DialogBox>
      </section>

      <section style={{ paddingBottom: "32px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}
        >
          Avatar
        </h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Avatar
            src="https://i.pravatar.cc/150?img=1"
            alt="John Doe"
            color="blue"
            variant="filled"
            indicator="offline"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=2"
            alt="Jane"
            color="green"
            variant="outlined"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=3"
            alt="Ravi"
            color="red"
            variant="shadow"
            size="lg"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=4"
            alt="Kumar"
            color="yellow"
            variant="subtle"
            radius="square"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=5"
            alt="Meera"
            color="blue"
            variant="filled"
            indicator="online"
          />
        </div>
      </section>
    </div>
  );
};

export default UIShowcase;
