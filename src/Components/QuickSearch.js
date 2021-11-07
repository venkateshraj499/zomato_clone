import "../Styles/Home.css";
import QuickSearchItem from "./QuickSearchItem";

function QuickSearch(props) {
  const quickSearchData = props.quickSearchData;
  let index = -1;
  const locId = props.locId;
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {quickSearchData.map((data) => {
            index++;
            return (
              <QuickSearchItem
                key={index}
                qsData={quickSearchData[index]}
                locationId={locId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuickSearch;
