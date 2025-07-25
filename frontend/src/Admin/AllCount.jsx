import React, { useEffect, useState } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Label,
  LabelList,
  Bar as RechartsBar,
} from "recharts";
import api from "../Api/Api";

const AllCount = () => {
  const [countUser, setCountUser] = useState(0);
  const [countEmployee, setEmployeeCount] = useState(0);
  const [roleData, setRoleData] = useState([]);

  const getMinWidth = (dataLength, barSize = 40) => {
    const buffer = 100;
    return dataLength * barSize + buffer;
  };

  // Fetch role-based counts
  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        const res = await api.get("/admin/user-role-count");
        setRoleData(res.data);
      } catch (err) {
        console.error("Failed to fetch role counts", err);
      }
    };

    fetchRoleCounts();
  }, []);

  const labels = roleData.map((item) => item._id.toUpperCase());
  const counts = roleData.map((item) => item.count);

  // Fetch employee and user count
  const fetchEmployeeCount = async () => {
    try {
      const res = await api.get("/admin/employeecount");
      setEmployeeCount(res.data || 0);
    } catch (err) {
      console.error("Error fetching employee count:", err);
    }
  };

  const fetchUserCount = async () => {
    try {
      const res = await api.get("/admin/usercount");
      setCountUser(res.data || 0);
    } catch (err) {
      console.error("Error fetching user count:", err);
    }
  };

  // Fetch employee/user count on mount and every 10s
  useEffect(() => {
    fetchEmployeeCount();
    fetchUserCount();

    const interval = setInterval(() => {
      fetchEmployeeCount();
      fetchUserCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Counts */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <div className="flex-1 min-w-[200px] max-w-xs bg-yellow-600 rounded-lg p-6 shadow-md text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Employee Count</h2>
          <p className="text-6xl font-bold text-white">{countEmployee}</p>
        </div>
        <div className="flex-1 min-w-[200px] max-w-xs bg-red-500 rounded-lg p-6 shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4 text-white">User Count</h2>
          <p className="text-6xl font-bold text-white">{countUser}</p>
        </div>
      </div>

      {/* Role-based User Count Chart */}
      <div className="w-full bg-white rounded shadow p-6">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Users by Role</h4>

        <div className="overflow-x-auto">
          <div
            style={{
              minWidth: `${getMinWidth(roleData.length)}px`,
              height: "400px",
              padding: "0 20px",
            }}
          >
            {roleData.length === 0 ? (
              <div className="text-center text-gray-500 text-lg">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roleData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="_id"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "#333", fontSize: 12 }}
                    axisLine={{ stroke: "#ccc" }}
                  >
                    <Label
                      value="Role"
                      offset={-20}
                      position="insideBottom"
                      style={{ fill: "#333", fontSize: 14 }}
                    />
                  </XAxis>
                  <YAxis
                    tick={{ fill: "#333", fontSize: 12 }}
                    axisLine={{ stroke: "#ccc" }}
                  >
                    <Label
                      value="Number of Users"
                      angle={-90}
                      offset={0}
                      position="insideLeft"
                      style={{ fill: "#333", fontSize: 14, textAnchor: "middle" }}
                    />
                  </YAxis>
                  <RechartsTooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <RechartsBar
                    dataKey="count"
                    fill="#3B82F6"
                    name="Users by Role"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="count"
                      position="top"
                      formatter={(value) => `${value}`}
                      style={{
                        fill: "#000",
                        fontSize: 12,
                        fontWeight: "500",
                      }}
                    />
                  </RechartsBar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCount;
