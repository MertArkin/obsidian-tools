
import { App, MarkdownPostProcessorContext, Component, MarkdownRenderer } from "obsidian"; // Import Notice from Obsidian API

//https://chatgpt.com/c/4816e2a8-2664-4eb2-8d72-286ff3c8a72e
//This is the Tesco calculating post processor in a code block
export async function initProcessor(this: any, source: string, el: HTMLElement, ctx: Component|any) {
  //DEFINITELY ADD: TRY CATCH FOR BAD CASES OF ROWS WITH , AND WITHOuT
  //how to print errors back to the code block !!!
  // in current stat puttin comma in codeblock in ohbsdian will craete empty columns/rows
  //TODO: handle edge cases (w friend (gokalp, timmy, etc))
  //https://docs.obsidian.md/Plugins/Editor/Markdown+post+processing
  //params are: source is data inside, el is element to render on, ctx is
  const rows = source.split("\n");
  // const data = {};
  const data: { [key: string]: any[] } = {};

  let currentMonth = "";
  let hasError = false;

  // Rendering the table
  const table = el.createEl("table");
  const body = table.createEl("tbody");
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].split(",");
    // if (cols.length === 1) {
    //   console.log("wrong output breaking");
    //   break;
    // }
    // console.log(cols);
    // console.log(rows);
    // Check for empty line
    // console.log("cols length:" + cols.length);
    //when have empty row (no data just space for better look) cols is 1create 2/x rows to match the design
    if (cols.length === 1 && cols[0].trim() === "") {
      const row = body.createEl("tr");
      row.createEl("td", { text: " " });
      row.createEl("td", { text: " " }); // Add a blank space in the table
      continue; // Skip further processing for this empty line
    }
    const row = body.createEl("tr");

    // keep adding csv like-data mathces below on if cases below
    //lets try (as we/you are adding more iffs, switch/trigger all the other ones to else if <-- check alson why this happens (why do we need this behaviour))
    if (cols[0].trim().startsWith("*")) {
      row.classList.add("special-row");
      console.log(cols[0]);
    }
    // Parsing CSV data by month
    //https://chat.openai.com/c/ee6304e5-7a30-42ec-8020-9e853896f51d
    else if (cols[0].trim() === "month" || cols[0].trim() === "MONTH") {
      // Your code here if the string is "month" or "MONTH"
      // Check if the month name is missing
      if (!cols[1] || cols[1].trim() === "") {
        // var hasError = true;
        hasError = true;
        break; // Exit the loop
      } else {
        row.classList.add("month-row");
        currentMonth = cols[1].trim();
        data[currentMonth] = [];
      }
    } else if (cols[0].trim() === "date") {
      // continue; // Skip date row (for now) when commented it doesnt work ? (visible | non-visible)
    } else if (cols[0].trim() === "calc") {
      // console.log(cols[1]); //it has to give "undefined" cause we are not specifying a comma or anything after comma
      // if (!cols[1] || cols[1].trim() === "") {
      //   var hasError = true;
      //   break; // Exit the loop
      // } else {
      // Calculate the total price for the month
      const totalPrice = data[currentMonth]
        .map((row) => parseFloat(row[1].replace("£", "").trim()))
        .reduce((acc, price) => acc + price, 0);
      // rows[i] = `calc, Total for ${currentMonth}: £${totalPrice}`;
      row.classList.add("calc-row");
      row.createEl("td", {
        text: "calc",
      });
      row.createEl("td", {
        text: `Total for ${currentMonth}: £${totalPrice}`,
      }); // Add the total price to the table
      continue; // Skip further processing for this "calc" line
      // }
    } else {
      console.log(currentMonth);
      if (currentMonth === "") {
        table.remove();

        // Render the error message using MarkdownRenderer
        MarkdownRenderer.render(
          this.app,
          `_**Error: Missing proper input!**_\nYour input is **"${cols}"**`,
          el,
          ctx.sourcePath,
          ctx
        );
      } else {
        // If it's not a control row, push it to the data array
        data[currentMonth].push(cols);
      }
    }

    // Create a table row for non-empty data
    // const row = body.createEl("tr");
    //this draws
    for (let j = 0; j < cols.length; j++) {
      row.createEl("td", { text: cols[j] });
    }
  }
  if (hasError) {
    // Clear the table contents if an error is detected
    table.remove();

    // Render the error message using MarkdownRenderer
    MarkdownRenderer.render(
      this.app,
      `_**Error: Missing ${rows[0]} input!**_\nYour input is **"${rows[0]}"**\nIt has to be ${rows[0]}, {params}`,
      el,
      ctx.sourcePath,
      ctx
    );
  }
}

// module.exports = { initProcessor };
