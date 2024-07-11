import React from 'react';

const TableExample: React.FC = () => {
  return (
    <main className="w-full flex-grow p-6">
      <h1 className="text-3xl text-black pb-6">Tables</h1>

      <div className="w-full mt-12">
        <p className="text-xl pb-3 flex items-center">
          <i className="fas fa-list mr-3"></i> Table Example
        </p>
        <div className="bg-white overflow-auto">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Name</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Last Name</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Phone</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-grey-lighter">
                <td className="py-4 px-6 border-b border-grey-light">Lian</td>
                <td className="py-4 px-6 border-b border-grey-light">Smith</td>
                <td className="py-4 px-6 border-b border-grey-light">622322662</td>
                <td className="py-4 px-6 border-b border-grey-light">jonsmith@mail.com</td>
              </tr>
              <tr className="hover:bg-grey-lighter">
                <td className="py-4 px-6 border-b border-grey-light">Lian</td>
                <td className="py-4 px-6 border-b border-grey-light">Smith</td>
                <td className="py-4 px-6 border-b border-grey-light">622322662</td>
                <td className="py-4 px-6 border-b border-grey-light">jonsmith@mail.com</td>
              </tr>
              <tr className="hover:bg-grey-lighter">
                <td className="py-4 px-6 border-b border-grey-light">Lian</td>
                <td className="py-4 px-6 border-b border-grey-light">Smith</td>
                <td className="py-4 px-6 border-b border-grey-light">622322662</td>
                <td className="py-4 px-6 border-b border-grey-light">jonsmith@mail.com</td>
              </tr>
              <tr className="hover:bg-grey-lighter">
                <td className="py-4 px-6 border-b border-grey-light">Lian</td>
                <td className="py-4 px-6 border-b border-grey-light">Smith</td>
                <td className="py-4 px-6 border-b border-grey-light">622322662</td>
                <td className="py-4 px-6 border-b border-grey-light">jonsmith@mail.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default TableExample;
