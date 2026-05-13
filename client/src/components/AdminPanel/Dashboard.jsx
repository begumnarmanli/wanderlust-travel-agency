import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./Dashboard.module.css";
import { API_URL } from "../../config";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    totalRevenue: 0,
  });

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateStats = React.useCallback((data) => {
    const total = data.length;
    const pending = data.filter((r) => r.status === "pending").length;
    const confirmed = data.filter((r) => r.status === "confirmed").length;
    const revenue = data.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

    setStats({
      totalReservations: total,
      pendingReservations: pending,
      confirmedReservations: confirmed,
      totalRevenue: revenue,
    });
  }, []);

  const fetchData = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReservations(data);
      calculateStats(data);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getLast7DaysData = () => {
    const last7Days = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const count = reservations.filter((r) => {
        const rDateStr = new Date(r.createdAt).toISOString().split("T")[0];
        return rDateStr === dateStr;
      }).length;

      last7Days.push({
        date: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        reservations: count,
      });
    }
    return last7Days;
  };

  const getTopDestinations = () => {
    const destinationCount = {};

    reservations.forEach((r) => {
      const key = r.country;
      destinationCount[key] = (destinationCount[key] || 0) + 1;
    });

    return Object.entries(destinationCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({
        country,
        bookings: count,
      }));
  };

  const getRegionDistribution = () => {
    const regionCount = {};

    reservations.forEach((r) => {
      const region = r.region;
      regionCount[region] = (regionCount[region] || 0) + 1;
    });

    return Object.entries(regionCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  const getStatusDistribution = () => {
    return [
      { name: "Pending", value: stats.pendingReservations },
      { name: "Confirmed", value: stats.confirmedReservations },
      {
        name: "Cancelled",
        value:
          stats.totalReservations -
          stats.pendingReservations -
          stats.confirmedReservations,
      },
    ];
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const STATUS_COLORS = ["#ffc107", "#28a745", "#dc3545"];

  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  const renderStatusLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={STATUS_COLORS[index]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="13px"
        fontWeight="700"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Reservations</div>
            <div className={styles.statValue}>{stats.totalReservations}</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardYellow}`}>
          <div className={`${styles.statIcon} ${styles.statIconYellow}`}>
            <i className="fas fa-clock"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Pending</div>
            <div className={styles.statValue}>{stats.pendingReservations}</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Confirmed</div>
            <div className={styles.statValue}>
              {stats.confirmedReservations}
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardCyan}`}>
          <div className={`${styles.statIcon} ${styles.statIconCyan}`}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Revenue</div>
            <div className={styles.statValue}>
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <i className="fas fa-chart-line"></i> Reservation Trend (Last 7
            Days)
          </h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={getLast7DaysData()}
                margin={{ top: 10, right: 10, left: -35, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="reservations"
                  stroke="#007bff"
                  strokeWidth={3}
                  dot={{
                    fill: "#007bff",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Destinations */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <i className="fas fa-map-marked-alt"></i> Top Destinations
          </h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                layout="vertical"
                data={getTopDestinations()}
                margin={{ top: 5, right: 45, left: -20, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="country"
                  type="category"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="bookings"
                  fill="#00C49F"
                  radius={[0, 10, 10, 0]}
                  barSize={15}
                >
                  <LabelList
                    dataKey="bookings"
                    position="right"
                    offset={10}
                    style={{
                      fill: "#666",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <i className="fas fa-globe"></i> Region Distribution
          </h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={getRegionDistribution()}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {getRegionDistribution().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <i className="fas fa-chart-pie"></i> Status Distribution
          </h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={getStatusDistribution()}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={renderStatusLabel}
                  outerRadius={60}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={4}
                >
                  {getStatusDistribution().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className={styles.recentSection}>
        <h3 className={styles.sectionTitle}>
          <i className="fas fa-history"></i> Recent Reservations
        </h3>
        {reservations.length > 0 ? (
          <div className={styles.recentList}>
            {reservations.slice(0, 5).map((res) => (
              <div key={res._id} className={styles.recentItem}>
                <div className={styles.recentIcon}>
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className={styles.recentDetails}>
                  <div className={styles.recentName}>{res.name}</div>
                  <div className={styles.recentInfo}>
                    {res.country} • {res.travelers}{" "}
                    {res.travelers === 1 ? "person" : "people"}
                  </div>
                </div>
                <div className={styles.recentMeta}>
                  <span
                    className={`${styles.recentStatus} ${styles[res.status]}`}
                  >
                    {res.status}
                  </span>
                  <div className={styles.recentDate}>
                    {new Date(res.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <i className="fas fa-inbox"></i>
            <p>No reservations yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
