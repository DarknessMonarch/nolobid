"use client";

import Image from "next/image";
import styles from "@/app/styles/table.module.css";

export default function TableComponent({ tableData }) {

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h1>Products Promoted</h1>
        <input type="date" name="table" className={styles.dateFilter} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Image</th>
            <th>Price(Ksh)</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className={styles.tableProfile}>
                    <Image
                      src={data.images?.[0]?.fileLink}
                      className={styles.tableProfileImage}
                      alt={data.productName}
                      width={30}
                      height={30}
                      priority={true}
                    />
                    {data.username}
                  </div>
                </td>
                <td>{data.productName}</td>
                <td>{data.productCode}</td>
                <td>{data.bidPrice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
