(async () => {
  const data = await fetch("data.json");
  const res = await data.json();

  // button segment
  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");

  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      addEmployeeModal.style.display = "none";
    }
  });

  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const values = [...formData.entries()];
    let empData = {};
    values.forEach((val) => {
      empData[val[0]] = val[1];
      console.log(empData);
    });
    console.log(values);

    empData.id = employees[employees.length - 1].id + 1;

    empData.imageUrl = empData.imageUrl || "https://svgur.com/i/16hm.svg";

    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18} -${new Date()
      .toISOString()
      .slice(5, 10)}`;

    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    employees.push(empData);
    renderImployees();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });

  let employees = res;
  let selectedEmployee = employees[0];
  // selected emplopyee data
  let selectedEmployeeId = employees[0].id;
  // selected employee Id

  const employeeList = document.querySelector(".employee__names--list");
  //   const employeeItem = document.querySelector(".employes__name--item")
  const employeeInfo = document.querySelector(".employee__single--info");

  // Select Employee LOGIC:
  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId != e.target.id) {
      selectedEmployeeId = e.target.id;
      renderImployees();
      // render Single Employee
    }

    if (e.target.tagName === "I") {
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );
    }
    if (String(selectedEmployeeId) === e.target.parentNode.id) {
      selectedEmployeeId = employees[0]?.id || -1;
      selectedEmployee = employees[0] || "";
      renderSingleEmplyee();
    }

    renderImployees();
  });

  const renderImployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employes__name--item");

      if (selectedEmployeeId == emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete" >❌</i> `;

      employeeList.append(employee);
      renderSingleEmplyee();
    });
  };

  const renderSingleEmplyee = (e) => {
    // deleting employee;
    if (selectedEmployeeId === -1) {
      employeeInfo.innerHTML = "";
      return;
    }
    employeeInfo.innerHTML = `
    <img class="profileImage" src="${selectedEmployee.imageUrl}" />
    <span class="employee__single--heading" >
    
    ${selectedEmployee.firstName} ${selectedEmployee.lastName} ( ${selectedEmployee.age} )
    <span>${selectedEmployee.address}</span>
    <span class="email" >${selectedEmployee.email}</span>
    <span>Mobile - ${selectedEmployee.contactNumber}</span>
    <span>DOB - ${selectedEmployee.dob}</span>
    </span>
    `;
  };

  if (selectedEmployee) renderSingleEmplyee();
  renderImployees();
})();
