import React from "react";
import { TbInfoCircle, TbX } from "react-icons/tb";

/**
 * Component to display help information about advanced search syntax
 */
const SearchSyntaxHelp = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <TbInfoCircle size={20} className="mr-2 text-primary" />
          Advanced Search Syntax Guide
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <TbX size={20} />
        </button>
      </div>

      <div className="prose prose-sm max-w-none">
        <p>
          You can use advanced search syntax directly in the search bar to
          create powerful queries. Here's how to use it:
        </p>

        <h3>Basic Field Search</h3>
        <p>
          Search within specific fields using the <code>field:value</code>{" "}
          syntax:
        </p>
        <pre className="bg-gray-50 p-2 rounded-md">name:laptop</pre>
        <p>This will search for items with "laptop" in the name field.</p>

        <h3>Operators</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left">
                Operator
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Example
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>name:laptop</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Contains (default)
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:=</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>category:=Electronics</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Equals exactly
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:!=</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>category:!=Electronics</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Does not equal
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:^</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>name:^Dell</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">Starts with</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:$</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>name:Pro$</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">Ends with</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:&gt;</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>price:&gt;100</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">Greater than</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:&lt;</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>quantity:&lt;10</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">Less than</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:[x TO y]</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>price:[100 TO 500]</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Between range
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:*</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>image:*</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">Field exists</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">!field:*</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>!image:*</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Field does not exist
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">:(x OR y)</td>
              <td className="border border-gray-300 px-3 py-2">
                <code>category:(Electronics OR Office)</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Is one of (IN)
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Combining Conditions</h3>
        <p>
          You can combine multiple conditions using <code>AND</code> and{" "}
          <code>OR</code> operators:
        </p>
        <pre className="bg-gray-50 p-2 rounded-md">
          name:laptop AND price:&lt;1000
        </pre>
        <p>This will find laptops with a price less than 1000.</p>
        <pre className="bg-gray-50 p-2 rounded-md">
          category:=Electronics OR category:=Accessories
        </pre>
        <p>
          This will find items in either the Electronics or Accessories
          categories.
        </p>

        <h3>Searchable Fields</h3>
        <ul>
          <li>
            <code>name</code> - Item name
          </li>
          <li>
            <code>description</code> - Item description
          </li>
          <li>
            <code>category</code> - Item category
          </li>
          <li>
            <code>location</code> - Item location
          </li>
          <li>
            <code>tags</code> - Item tags
          </li>
          <li>
            <code>price</code> - Item price
          </li>
          <li>
            <code>quantity</code> - Item quantity
          </li>
          <li>
            <code>barcode</code> - Item barcode or SKU
          </li>
          <li>
            <code>updatedAt</code> - Last update date
          </li>
        </ul>

        <h3>Examples</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left">
                Query
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2">
                <code>name:dell AND category:=Electronics</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Dell items in Electronics category
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">
                <code>quantity:&lt;5 AND !location:*</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Low stock items with no location assigned
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">
                <code>tags:(laptop OR computer) AND price:[500 TO 1500]</code>
              </td>
              <td className="border border-gray-300 px-3 py-2">
                Laptops or computers with price between 500 and 1500
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default SearchSyntaxHelp;
