import React from "react";

export default function DonorTable({ donors }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra bg-white rounded-xl shadow-md">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Blood Group</th>
            <th>Last Donated</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {donors.map((donor, index) => {
            // Calculate eligible or not (90 days rule)
            const last = new Date(donor.lastDonated);
            const now = new Date();
            const diff = (now - last) / (1000 * 60 * 60 * 24);

            const eligible = diff >= 90;

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{donor.name}</td>
                <td>
                  <span className="badge badge-secondary">{donor.bloodGroup}</span>
                </td>
                <td>{donor.lastDonated}</td>
                <td>
                  {eligible ? (
                    <span className="badge badge-success">Eligible</span>
                  ) : (
                    <span className="badge badge-warning">Not Eligible</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline">View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}