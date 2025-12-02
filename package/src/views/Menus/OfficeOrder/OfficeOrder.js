/**
 * @file OfficeOrderPage.js
 * @description 
 * Main page for displaying office order modules as cards with counts.
 * Clicking on any count opens the corresponding OfficeOrderTable.
 *
 * Features:
 * - Fetches office order modules from backend
 * - Fetches dynamic counts for each module
 * - Displays error alerts
 * - Opens table view on count click with filter applied
 *
 * @author Susmitha
 * @date 30-Sep-2025
 * @version 1.2.0
 */

import React, { useState, useEffect } from "react";
import { taskCardStyles as styles } from "src/components/ui/StatCards.js";
import Cookies from "js-cookie";
import { decryptData, validateJsonData } from "src/components/Decryption/Decrypt";
import { HostName } from "src/assets/host/Host";
import Alerts from "src/components/ui/Alerts.js";
import OfficeOrderTable from "src/views/OfficeOrder/OfficeOrderTable.js";


/* ===========================================================
   COMPONENT: OfficeOrderCard
   =========================================================== */
const OfficeOrderCard = ({ order, onCountClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCount, setHoveredCount] = useState(null);

  const [counts, setCounts] = useState({
    complete: 0,
    need_to_generate: 0,
    ongoing: 0,
    saveandhold: 0,
  });

  const sessionId = Cookies.get("session_id");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const jwtToken = Cookies.get("HRToken");
        if (!jwtToken) throw new Error("No JWT token found in cookies");

        const response = await fetch(`${HostName}/OfficeOrder_Count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            token: "HRFGVJISOVp1fncC",
            session_id: sessionId,
          }),
        });

        const encryptedData = await response.json();
        const decrypted = await decryptData(encryptedData.Data);
        const parsedData =
          typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;

        const record = parsedData?.Data;
        if (record) {
          setCounts({
            complete: Number(record.complete) || 0,
            need_to_generate: Number(record.need_to_generate) || 0,
            ongoing: Number(record.ongoing) || 0,
            saveandhold: Number(record.saveandhold) || 0,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, [sessionId, order.id]);

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
      {/* Header Section */}
      <div style={{ padding: "24px 24px 16px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: order.borderColor,
              boxShadow: `0 0 10px ${order.borderColor}60`,
              flexShrink: 0,
            }}
          />
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: "1.4",
            }}
          >
            {order.title}
          </h3>
        </div>

        {order.description && (
          <p
            style={{
              fontSize: "13px",
              color: "#6B7280",
              margin: "0 0 0 22px",
              lineHeight: "1.6",
            }}
          >
            {order.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)",
          margin: "0 20px 16px 20px",
        }}
      />

      {/* Count Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          padding: "0 24px 24px 24px",
          flex: 1,
        }}
      >
        {countCardConfigs.map((config) => (
          <div
            key={config.key}
            style={{
              background: config.background,
              border: `2px solid ${
                hoveredCount === config.key ? config.borderColor : "transparent"
              }`,
              padding: "18px 14px",
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.25s ease",
              transform:
                hoveredCount === config.key ? "scale(1.03)" : "scale(1)",
              boxShadow:
                hoveredCount === config.key
                  ? `0 6px 16px ${config.borderColor}35`
                  : "0 2px 4px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "110px",
            }}
            onClick={() => onCountClick(order, config.key)}
            onMouseEnter={() => setHoveredCount(config.key)}
            onMouseLeave={() => setHoveredCount(null)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  opacity: 0.8,
                }}
              >
                {config.icon}
              </span>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: config.labelColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  lineHeight: "1.3",
                }}
              >
                {config.label}
              </div>
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: config.valueColor,
                lineHeight: "1",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {counts[config.key]}
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

/* ===========================================================
   COMPONENT: OfficeOrderPage
   =========================================================== */
const OfficeOrderPage = () => {
  const [officeOrders, setOfficeOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showTable, setShowTable] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const sessionId = Cookies.get("session_id");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const jwtToken = Cookies.get("HRToken");
        if (!jwtToken) throw new Error("No JWT token found in cookies");

        const response = await fetch(`${HostName}/OfficeOrder_module`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            token: "HRFGVJISOVp1fncC",
            order_type_id: "1",
            session_id: sessionId,
          }),
        });

        const encryptedData = await response.json();
        const encryptedPayload = encryptedData.Data ?? encryptedData.data;

        if (encryptedPayload) {
          const decryptedData = await decryptData(encryptedPayload);
          const parsedData = validateJsonData(decryptedData);

          const parsedStatus = parsedData?.Status ?? parsedData?.status;
          const records =
            parsedData?.Data?.Records ??
            parsedData?.records ??
            parsedData?.data?.records;

          if (parsedStatus === 200 && Array.isArray(records)) {
            const formattedOrders = records.map((item, idx) => ({
              id: item.module_id,
              title: item.process_name,
              description: item.description,
              code: item.process_code,
              bgColor: ["#ECFDF5", "#FFFBEB", "#EFF6FF", "#F3E8FF"][idx % 4],
              borderColor: ["#00baa2", "#2b7fff", "#ca3500", "#9810fa"][idx % 4],
            }));

            setOfficeOrders(formattedOrders);
          } else {
            setError("No records found in parsed data.");
          }
        } else {
          setError("Encrypted payload missing in response.");
        }
      } catch (err) {
        console.error("❌ API fetch error:", err);
        setError(err.message || "Something went wrong while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sessionId]);

  const handleCountClick = (order, filter) => {
    setSelectedOrder(order);
    setSelectedFilter(filter);
    setShowTable(true);
  };

  const handleBack = () => {
    setShowTable(false);
    setSelectedOrder(null);
    setSelectedFilter(null);
  };
  return (
    <div
      style={{
        maxWidth: "1800px",
        margin: "0 auto",
        padding: "14px",
        //background: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      {!showTable && (
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Office Order Management
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6B7280",
              margin: 0,
            }}
          >
            Manage and track all office orders across different modules
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            Loading office orders...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ marginBottom: "20px" }}>
          <Alerts type="error" message={error} />
        </div>
      )}

      {/* Card Grid */}
      {!loading && !showTable && (
        <main>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "28px",
            }}
          >
            {officeOrders.length > 0 ? (
              officeOrders.map((order) => (
                <OfficeOrderCard
                  key={order.id}
                  order={order}
                  onCountClick={handleCountClick}
                />
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px",
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    color: "#6B7280",
                    margin: 0,
                  }}
                >
                  No office orders available at the moment.
                </p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Table View */}
      {showTable && (
        <OfficeOrderTable
          order={selectedOrder}
          filter={selectedFilter}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default OfficeOrderPage;