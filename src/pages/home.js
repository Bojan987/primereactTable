import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import data from "../products-small.json";
import Title from "../components/title";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [columns, setColumns] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importedData, setImportedData] = useState([]);
  const [selectedImportedData, setSelectedImportedData] = useState([]);
  const [importedCols, setImportedCols] = useState([
    { field: "", header: "Header" },
  ]);
  const dt = useRef(null);
  const toast = useRef(null);
  const [colsReordered, setColsReordered] = useState([
    { field: "code", header: "Code", order: 0 },
    { field: "name", header: "Name", order: 1 },
    { field: "category", header: "Category", order: 2 },
    { field: "quantity", header: "Quantity", order: 3 },
    { field: "id", header: "ID", order: 4 },
    { field: "description", header: "Description", order: 5 },
    { field: "bojan", header: "Bojan", order: 6 },
  ]);

  const cols = [
    { field: "code", header: "Code", order: 0 },
    { field: "name", header: "Name", order: 1 },
    { field: "category", header: "Category", order: 2 },
    { field: "quantity", header: "Quantity", order: 3 },
  ];

  useEffect(() => {
    setProducts(data.data);
    setColumns((previous) => {});
  }, []);

  const resizer = (e) => {
    console.log(e.columns);
    const currentColumns = e.columns;
    const { dropIndex, dragIndex } = e;
    console.log(dropIndex, dragIndex);

    const reorderedColumns = currentColumns.reduce(
      (accumulator, currentColumn) => {
        const columnAdd = {
          field: currentColumn.props.field,
          header: currentColumn.props.header,
        };
        accumulator.push(columnAdd);
        return accumulator;
      },
      []
    );
    console.log(reorderedColumns);
    setColsReordered(reorderedColumns);
  };

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const importCSV = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split("\n");

      // Prepare DataTable
      const cols = data[0].split(",");
      data.shift();

      let _importedCols = cols.map((col) => ({
        field: col,
        header: toCapitalize(col.replace(/['"]+/g, "")),
      }));
      let _importedData = data.map((d) => {
        d = d.split(",");
        return cols.reduce((obj, c, i) => {
          obj[c] = d[i].replace(/['"]+/g, "");
          return obj;
        }, {});
      });

      setImportedCols(_importedCols);
      setImportedData(_importedData);
    };

    reader.readAsText(file, "UTF-8");
  };

  const importExcel = (e) => {
    const file = e.files[0];

    import("xlsx").then((xlsx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = xlsx.read(e.target.result, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        // Prepare DataTable
        const cols = data[0];
        console.log(cols);
        data.shift();

        let _importedCols = cols.map((col) => ({
          field: col.replace(/\s/g, ""),
          header: toCapitalize(col),
        }));
        let _importedData = data.map((d) => {
          return cols.reduce((obj, c, i) => {
            console.log(`D je:${d},OBJ JE : ${obj},C JE :${c},I JE ${i}`);
            obj[c.replace(/\s/g, "")] = d[i];
            return obj;
          }, {});
        });

        setImportedCols(_importedCols);
        setImportedData(_importedData);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, products);
        doc.save("products.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "products");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  };

  const toCapitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const clear = () => {
    setImportedData([]);
    setSelectedImportedData([]);
    setImportedCols([{ field: "", header: "Header" }]);
  };

  const onImportSelectionChange = (e) => {
    setSelectedImportedData(e.value);
    const detail = e.value.map((d) => Object.values(d)[0]).join(", ");
    toast.current.show({
      severity: "info",
      summary: "Data Selected",
      detail,
      life: 3000,
    });
  };

  const onSelectionChange = (e) => {
    setSelectedProducts(e.value);
  };

  const header = (
    <div className="p-d-flex p-ai-center export-buttons">
      <Button
        type="button"
        icon="pi pi-file-o"
        onClick={() => exportCSV(false)}
        className="p-mr-2"
        data-pr-tooltip="CSV"
      />
      <Button
        type="button"
        icon="pi pi-file-excel"
        onClick={exportExcel}
        className="p-button-success p-mr-2"
        data-pr-tooltip="XLS"
      />
      <Button
        type="button"
        icon="pi pi-file-pdf"
        onClick={exportPdf}
        className="p-button-warning p-mr-2"
        data-pr-tooltip="PDF"
      />
      <Button
        type="button"
        icon="pi pi-filter"
        onClick={() => exportCSV(true)}
        className="p-button-info p-ml-auto"
        data-pr-tooltip="Selection Only"
      />
    </div>
  );

  return (
    <div className="inner">
      {/* <Title
        lineContent="Solving Solutions that"
        lineContent2="need expert insight"
      />
      <div>
        <p className="other">
          Does project report used question death, out more rhetoric unpleasing
          what compared both of sentinels.
        </p>
      </div>  */}

      <div>
        <div className="card">
          <h5>Import</h5>

          <Toast ref={toast} />

          <div className="p-d-flex p-ai-center p-py-2">
            <FileUpload
              chooseOptions={{ label: "CSV", icon: "pi pi-file-o" }}
              mode="basic"
              name="demo[]"
              auto
              url="https://primefaces.org/primereact/showcase/upload.php"
              accept=".csv"
              className="p-mr-2"
              onUpload={importCSV}
            />
            <FileUpload
              chooseOptions={{
                label: "Excel",
                icon: "pi pi-file-excel",
                className: "p-button-success",
              }}
              mode="basic"
              name="demo[]"
              auto
              url="https://primefaces.org/primereact/showcase/upload.php"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="p-mr-2"
              onUpload={importExcel}
            />
            <Button
              type="button"
              label="Clear"
              icon="pi pi-times"
              onClick={clear}
              className="p-button-info p-ml-auto"
            />
          </div>

          <DataTable
            value={importedData}
            emptyMessage="No data"
            paginator
            rows={10}
            alwaysShowPaginator={false}
            selectionMode="multiple"
            selection={selectedImportedData}
            onSelectionChange={onImportSelectionChange}
          >
            {importedCols.map((col, index) => (
              <Column key={index} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </div>
        <div className="card">
          <h5>Export</h5>

          <Tooltip target=".export-buttons>button" position="bottom" />

          <DataTable
            ref={dt}
            value={products}
            header={header}
            dataKey="id"
            selectionMode="multiple"
            selection={selectedProducts}
            onSelectionChange={onSelectionChange}
          >
            {cols.map((col, index) => (
              <Column key={index} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </div>
        <div className="card">
          <h5>Fit Mode</h5>
          <DataTable
            value={products}
            resizableColumns
            columnResizeMode="fit"
            showGridlines
            onColumnResizeEnd={resizer}
            reorderableColumns
            onColReorder={resizer}
          >
            {/* <Column field="code" header="Code" style={{width:'20%'}}  />
                    <Column field="name" header="Name" style={{width:'40%'}}/>
                    <Column field="category" header="Category" style={{width:'20%'}}/>
                    <Column field="quantity" header="Quantity" style={{width:'20%'}}/>
                    <Column field="id" header="ID" style={{width:'20%'}}/>
                    <Column field="description" header="Description" style={{width:'20%'}}/>
                    <Column field="bojan" header="Bojan" style={{width:'20%'}}/> */}
            {colsReordered.map((col, index) => (
              <Column key={index} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </div>

        <div className="card">
          <h5>Expand Mode</h5>
          <DataTable
            value={products}
            resizableColumns
            columnResizeMode="expand"
            showGridlines
          >
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Home;
