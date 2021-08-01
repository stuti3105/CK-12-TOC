let table = document.getElementById("table");

//function to sort fetched response
const sortData = (data) => {
  let sortedData = [];
  data.forEach((item) => {
    sortedData[item.sequenceNO] = item;
  });

  return sortedData;
};

// onPress of row
const onPress = async (object, id, sequenceNO) => {
  let content = object.nextElementSibling;

  if (!content.innerHTML) {
    //fetch if there is no content
    let tableContent = await appendCollapsed({ id, sequenceNO });
    content.innerHTML = tableContent;
  }

  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
};

//function to generate content of each row
const appendCollapsed = async ({ id, sequenceNO }) => {
  let response;
  try {
    response = await fetch(
      `http://localhost:3000/api/book/maths/section/${id}`
    );
    response = await response.json();
  } catch (error) {
    console.log(error);
  }

  let sortedResponse =
    response.response &&
    response.response[id] &&
    sortData(response.response[id]);

  let content =
    sortedResponse
      ?.map((item) => {
        let COMPLETE = "#4CAF50";
        let IN_PROGRESS = "#ffaa00";
        let NOT_STARTED = "grey";

        let status = eval(`${item.status}`);
        return `<h4 style = "color: ${status}">${sequenceNO}.${item.sequenceNO} ${item.title}</h4>`;
      })
      .join("") ||
    `<h4 style = "color: grey">${
      response.response?.message || "Data not found"
    }</h4>`;

  return `${content}`;
};

//function to generate a row.
const generateRow = (data) => {
  let status = ((data.completeCount / data.childrenCount) * 100).toFixed();

  status = isNaN(status) ? "" : "(" + status + "% completed)";

  return `<button type="button" onClick= "onPress(this, ${data.id}, ${data.sequenceNO})">
     ${data.sequenceNO}. ${data.title}  ${status}
    </button><div></div>`;
};

//function to generate all the rows
const generateTable = (elementToPopulate) => {
  let promise = [];

  fetch("http://localhost:3000/api/book/maths")
    .then((response) => response.json())
    .then(({ response }) => {
      let sortedResponse = sortData(response);
      sortedResponse.forEach((row) => {
        promise.push(generateRow(row));
      });

      Promise.all(promise).then((result) => {
        return (elementToPopulate.innerHTML = result.join(""));
      });
    })
    .catch((data) => console.log(data));
};

//call method to generate table
generateTable(table);
