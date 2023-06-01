export function CategoryForm(props) {
  return (
    <div className="p-3">
      <form onSubmit={props.handleSubmit}>
      {props.photo?.size && (
              <div className="text-center">
                <img src={URL.createObjectURL(props.photo)} alt="product" className="img img-responsive" height="200px" />
              </div>
            )}
            <div className="pt-2">
              <label className="btn btn-outline-secondary p-2 col-12 mb-3">
                {props.photo?.length ? props.photo.name : "Upload Photo"}
                <input type="file" name="photo" accept="image/*" onChange={(e) => props.setPhoto(e.target.files[0])} hidden />
              </label>
            </div>
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

export function CategoryFormUpdate(props) {

  return (
    <div className="p-3">
      <form onSubmit={props.handleSubmit}>
      {props.photo?.size ? (
              <div className="text-center">
                <img src={URL.createObjectURL(props.photo)} alt="product" className="img img-responsive" height="200px" />
              </div>
            ) : (
              <div className="text-center">
                {/* Fetch the latest image */}
                <img
                  src={`${process.env.REACT_APP_API}/category/photo/${props.id}`}
                  alt="category"
                  className="img img-responsive"
                  height="200px"
                />
              </div>
            )}
            <div className="pt-2">
              <label className="btn btn-outline-secondary p-2 col-12 mb-3">
                {props.photo?.length ? props.photo.name : "Upload Photo"}
                <input type="file" name="photo" accept="image/*" onChange={(e) => props.setPhoto(e.target.files[0])} hidden />
              </label>
            </div>
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