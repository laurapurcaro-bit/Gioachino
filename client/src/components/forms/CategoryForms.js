export default function CategoryForm(props) {
  return (
    <div className="p-3">
      <form onSubmit={props.handleSubmit}>
        <input
          type="text"
          className="form-control p-3"
          placeholder="Write category name"
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
        ></input>
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary mt-3">{props.BtnName}</button>
          {/* If handleDelete is passed, show delete button */}
          {props.handleDelete && (
            <button
              onClick={props.handleDelete}
              className="btn btn-danger mt-3"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
