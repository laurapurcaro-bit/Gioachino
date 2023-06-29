import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import styling from "./SingleWhishlist.module.css";
import { Trans } from "react-i18next";

export default function SingleWhishlist() {
  // context
  const params = useParams();
  const [auth] = useAuth();
  // hooks
  const [whishlist, setWhishlist] = useState({});

  useEffect(() => {
    if (params?.whishlistId) {
      loadWhishlist();
    }
    // make request only when slug changes
    // eslint-disable-next-line
  }, [params?.whishlistId]);

  const loadWhishlist = async () => {
    try {
      const { data } = await axios.post(`/whishlist/${params.whishlistId}`, {
        userId: auth?.user?._id,
      });
      setWhishlist(data);
      console.log("Wh!", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className={styling.whishlistName}>
        <h1>{whishlist.name}</h1>
        <hr />
        <WhishlistProducts whishlist={whishlist} />
      </div>
    </div>
  );
}

function WhishlistProducts({ whishlist }) {
  console.log("WhishlistProducts", whishlist);
  return (
    <div>
      <div className={`${styling.containerPreview}`}>
        {whishlist?.savedItems?.map((item, index) => {
          return (
            <div key={index}>
              {item ? (
                <img
                  className={styling.img}
                  src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${item.category}/${item.productId}-0.png`}
                  alt={"img"}
                  height="100%"
                  width="100%"
                />
              ) : (
                <p></p>
              )}
              <h5>{}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
}
