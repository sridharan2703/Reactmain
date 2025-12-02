/**
 * @file OfficeOrderPage.js
 * @description
 * Main page for displaying office order modules as cards with counts.
 * Updated: Fixed layout to handle dynamic table width and sidebar resizing.
 * @module OfficeOrderCard
 * @author Susmitha
 * @date 01/11/2025
 * @since 1.0.0
 * @modifiedby Elakiya
 * @modifiedon 21-11-2025
 */

import React, { useState, useEffect } from "react";
import { taskCardStyles as styles } from "src/components/ui/StatCards.js";
import Cookies from "js-cookie";
import { HostName } from "src/assets/host/Host";
import Alerts from "src/components/ui/Alerts.js";
import OfficeOrderTable from "src/views/OfficeOrder/OfficeOrderTable.js";
import {
  decryptData,
  encryptPayloadForGo,
} from "src/components/Encryption/EncryptionKey";

/**
 * @typedef {object} OfficeOrderModule
 * @property {string | number} id - Unique ID of the module (used to fetch counts).
 * @property {string} title - Display title of the module.
 * @property {string} description - Short description of the module.
 * @property {string} code - Process code.
 * @property {string} bgColor - Background color for the card/elements.
 * @property {string} borderColor - Primary accent color for the card/elements.
 */

/**
 * Displays a card for a single Office Order module, fetching and showing counts
 * for different task statuses (Completed, New, Ongoing, Draft).
 *
 * @param {object} props - The component props.
 * @param {OfficeOrderModule} props.order - The module data (ID, title, colors, etc.).
 * @param {function(OfficeOrderModule, 'complete' | 'need_to_generate' | 'ongoing' | 'saveandhold'): void} props.onCountClick - Handler executed when a count card is clicked.
 * @returns {JSX.Element} The Office Order Card component.
 */
const OfficeOrderCard = ({ order, onCountClick }) => {
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isHovered, setIsHovered] = useState(false);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [hoveredCount, setHoveredCount] = useState(null);

  /**
   * @typedef {object} CountData
   * @property {number} complete - Count of completed orders.
   * @property {number} need_to_generate - Count of new orders to be generated.
   * @property {number} ongoing - Count of ongoing orders.
   * @property {number} saveandhold - Count of draft orders.
   */
  /** @type {[CountData, React.Dispatch<React.SetStateAction<CountData>>]} */
  const [counts, setCounts] = useState({
    complete: 0,
    need_to_generate: 0,
    ongoing: 0,
    saveandhold: 0,
  });

  /**
   * Effect to fetch the latest counts for the module from the API.
   */
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (!order?.id) return;

        const sessionId = Cookies.get("session_id");
        const jwtToken = Cookies.get("HRToken");

        if (!sessionId || !jwtToken) return;

        const encryptedPayload = await encryptPayloadForGo({
          token: "HRFGVJISOVp1fncC",
          session_id: sessionId,
          module_id: order.id,
        });

        const response = await fetch(`${HostName}/OfficeOrder_Count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ Data: encryptedPayload }),
        });

        if (!response.ok) return;
        
        const encryptedResponse = await response.json();
        const encryptedData = encryptedResponse.Data ?? encryptedResponse.data;
        
        if (!encryptedData) return;

        let record = null;
        // 🔍 If backend sent decrypted JSON object already
        if (typeof encryptedData === "object") {
          record = encryptedData?.Data ?? encryptedData?.data ?? encryptedData;
        } 
        // 🔐 If backend sent string → decrypt it
        else {
          const parsedData = await decryptData(encryptedData);
          record = parsedData?.Data ?? parsedData?.data;
        }

        if (record) {
          setCounts({
            complete: Number(record.complete) || 0,
            need_to_generate: Number(record.need_to_generate) || 0,
            ongoing: Number(record.ongoing) || 0,
            saveandhold: Number(record.saveandhold) || 0,
          });
        }
      } catch (err) {
        // Silent fail for counts to not disrupt the main page
      }
    };

    fetchCounts();
  }, [order?.id]);

  const containerDynamicStyle = {
    ...styles.container,
    background: "#FFFFFF",
    borderRadius: "16px",
    borderTop: `4px solid ${order.borderColor}`,
    borderBottom: `1px solid #E5E7EB`,
    borderLeft: `1px solid #E5E7EB`,
    borderRight: `1px solid #E5E7EB`,
    boxShadow: isHovered
      ? `0 12px 24px rgba(0,0,0,0.12), 0 0 0 2px ${order.borderColor}20`
      : "0 2px 8px rgba(0,0,0,0.08)",
    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    overflow: "hidden",
    minHeight: "440px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const countCardConfigs = [
    {
      key: "complete",
      label: "Completed",
      background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
      borderColor: "#0EA5E9",
      labelColor: "#075985",
      valueColor: "#0284C7",
      icon: "✓",
    },
    {
      key: "need_to_generate",
      label: "New Orders",
      background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
      borderColor: "#F59E0B",
      labelColor: "#92400E",
      valueColor: "#D97706",
      icon: "⚡",
    },
    {
      key: "ongoing",
      label: "Ongoing",
      background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
      borderColor: "#10B981",
      labelColor: "#065F46",
      valueColor: "#059669",
      icon: "⟳",
    },
    {
      key: "saveandhold",
      label: "Draft",
      background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
      borderColor: "#8B5CF6",
      labelColor: "#5B21B6",
      valueColor: "#7C3AED",
      icon: "⊙",
    },
  ];

  return (
    <div
      style={containerDynamicStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: "24px 24px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: order.borderColor, boxShadow: `0 0 10px ${order.borderColor}60`, flexShrink: 0 }} />
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0, letterSpacing: "-0.01em", lineHeight: "1.4" }}>
            {order.title}
          </h3>
        </div>
        {order.description && (
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 0 22px", lineHeight: "1.6" }}>
            {order.description}
          </p>
        )}
      </div>
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)", margin: "0 20px 16px 20px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", padding: "0 24px 24px 24px", flex: 1 }}>
        {countCardConfigs.map((config) => (
          <div
            key={config.key}
            style={{
              background: config.background,
              border: `2px solid ${hoveredCount === config.key ? config.borderColor : "transparent"}`,
              padding: "18px 14px",
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.25s ease",
              transform: hoveredCount === config.key ? "scale(1.03)" : "scale(1)",
              boxShadow: hoveredCount === config.key ? `0 6px 16px ${config.borderColor}35` : "0 2px 4px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "110px",
            }}
            onClick={() => onCountClick(order, config.key)}
            onMouseEnter={() => setHoveredCount(config.key)}
            onMouseLeave={() => setHoveredCount(null)}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "10px" }}>
              <span style={{ fontSize: "16px", opacity: 0.8 }}>{config.icon}</span>
              <div style={{ fontSize: "11px", fontWeight: "600", color: config.labelColor, textTransform: "uppercase", letterSpacing: "0.6px", lineHeight: "1.3" }}>
                {config.label}
              </div>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: config.valueColor, lineHeight: "1", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
              {counts[config.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main page component for Office Order Management.
 * Displays module cards and handles switching to the detailed OfficeOrderTable view.
 *
 * @returns {JSX.Element} The Office Order Page component.
 */
const OfficeOrderPage = () => {
  /** @type {[OfficeOrderModule[], React.Dispatch<React.SetStateAction<OfficeOrderModule[]>>]} */
  const [officeOrders, setOfficeOrders] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(true);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [error, setError] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [showTable, setShowTable] = useState(false);
  /** @type {[OfficeOrderModule | null, React.Dispatch<React.SetStateAction<OfficeOrderModule | null>>]} */
  const [selectedOrder, setSelectedOrder] = useState(null);
  /** @type {['complete' | 'need_to_generate' | 'ongoing' | 'saveandhold' | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [selectedFilter, setSelectedFilter] = useState(null);

/**
 * Effect to fetch the list of available Office Order modules from the API on component mount.
 */
useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const sessionId = Cookies.get("session_id");
      const jwtToken = Cookies.get("HRToken");

      if (!sessionId) throw new Error("No session_id found in cookies");
      if (!jwtToken) throw new Error("No JWT token found in cookies");

      const encryptedPayload = await encryptPayloadForGo({
        token: "HRFGVJISOVp1fncC",
        order_type_id: "1",
        session_id: sessionId,
      });

      const response = await fetch(`${HostName}/OfficeOrder_module`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ Data: encryptedPayload }),
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const encryptedResponse = await response.json();
      const encryptedData = encryptedResponse.Data ?? encryptedResponse.data;

      if (!encryptedData) throw new Error("Encrypted payload missing in response");

      let records = [];

      // 🔍 If backend sent decrypted JSON object already
      if (typeof encryptedData === "object") {
        const recordData =
          encryptedData?.Data ??
          encryptedData?.data ??
          encryptedData;

        records =
          recordData?.Records ??
          recordData?.records ??
          [];
      } 
      // 🔐 If backend sent string → decrypt it
      else {
        const parsedData = await decryptData(encryptedData);

        records =
          parsedData?.Data?.Records ??
          parsedData?.Data?.records ??
          parsedData?.data?.Records ??
          parsedData?.data?.records ??
          parsedData?.Records ??
          parsedData?.records ??
          [];
      }

      // 🟢 Format response
      if (records.length > 0) {
        const formattedOrders = records.map((item, idx) => ({
          id: item.module_id,
          title: item.process_name,
          description: item.description,
          code: item.process_code,
          bgColor: ["#ECFDF5", "#FFFBEB", "#EFF6FF", "#F3E8FF"][idx % 4],
          borderColor: ["#00baa2", "#2b7fff", "#ca3500", "#9810fa"][idx % 4],
        }));

        setOfficeOrders(formattedOrders);
      }

    } catch (err) {
      setError(err.message || "Failed to fetch office orders");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);


  /**
   * Handler when a count box on a module card is clicked.
   * Switches the view to the detailed OfficeOrderTable.
   * @param {OfficeOrderModule} order - The selected module object.
   * @param {'complete' | 'need_to_generate' | 'ongoing' | 'saveandhold'} filter - The filter key to apply to the table.
   */
  const handleCountClick = (order, filter) => {
    setSelectedOrder(order);
    setSelectedFilter(filter);
    setShowTable(true);
  };

  /**
   * Handler to switch back from the OfficeOrderTable view to the main Card Grid view.
   */
  const handleBack = () => {
    setShowTable(false);
    setSelectedOrder(null);
    setSelectedFilter(null);
  };

  return (
     <div
      style={{
        width: "100%",  
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "14px",
        boxSizing: "border-box", 
        overflow: showTable ? "hidden" : "auto", 
      }}
    >
      {/* Header Section - Hide when table is shown */}
      {!showTable && (
        <div style={{ marginBottom: "28px", flexShrink: 0 }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
            Office Order Management
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Manage and track all office orders across different modules
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px" }}>
          <div style={{ fontSize: "15px", color: "#6B7280", fontWeight: "500" }}>Loading office orders...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ marginBottom: "20px" }}>
          <Alerts type="error" message={error} />
        </div>
      )}

      {/* CONTENT AREA */}
      {/* 1. Card Grid View */}
      {!loading && !showTable && (
        <main style={{ flexGrow: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}>
            {officeOrders.length > 0 ? (
              officeOrders.map((order) => (
                <OfficeOrderCard
                  key={order.id}
                  order={order}
                  onCountClick={handleCountClick}
                />
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: "15px", color: "#6B7280", margin: 0 }}>No office orders available at the moment.</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 2. Table View - Wrapped to handle width correctly */}
      {showTable && (
        <div 
          style={{ 
            flexGrow: 1, 
            width: "100%", 
            minHeight: 0, 
            minWidth: 0, 
            display: "flex",
            flexDirection: "column"
          }}
        >
          <OfficeOrderTable
            order={selectedOrder}
            filter={selectedFilter}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
};

export default OfficeOrderPage;