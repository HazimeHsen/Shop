import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorCatch from "../../../ErrorCatch";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Button, Col, Container, Row } from "react-bootstrap";
import Rating from "../../Rating/Rating";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import { LinkContainer } from "react-router-bootstrap";
import MainScreenComponents from "../MainScreen/MainScreenComponents/MainScreenComponents";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];
export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },
  {
    name: "3stars & up",
    rating: 3,
  },
  {
    name: "2stars & up",
    rating: 2,
  },
  {
    name: "1stars & up",
    rating: 1,
  },
];
export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        setCategories(data);
      } catch (error) {
        toast.error(ErrorCatch(error));
      }
    };
    fetchCategories();
  }, []);
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = sp.get("query") || category;
    const filterQuery = sp.get("price") || query;
    const filterRating = sp.get("rating") || rating;
    const filterPrice = sp.get("order") || price;
    const filterOrder = sp.get("page") || order;
    return {
      pathname: "/api/products/search",
      search: `?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`,
    };
  };

  return (
    <div>
      <Container>
        <Helmet>
          <title>Search Products</title>
        </Helmet>
        <Row>
          <Col md={3}>
            <h3>Deparment</h3>
            <div>
              <ul>
                <li>
                  <Link
                    className={"all" === category ? "text-bold" : ""}
                    to={getFilterUrl({ category: "all" })}>
                    Any
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      className={c === category ? "text-bold" : ""}
                      to={getFilterUrl({ category: c })}>
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Price</h3>
              <ul>
                <li>
                  <Link
                    className={"all" === price ? "text-bold" : ""}
                    to={getFilterUrl({ price: "all" })}>
                    Any
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p}>
                    <Link
                      className={p.value === price ? "text-bold" : ""}
                      to={getFilterUrl({ price: p.value })}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Avg. Customer Review</h3>
              <ul>
                {ratings.map((r) => (
                  <li key={r}>
                    <Link
                      className={r.rating === rating ? "text-bold" : ""}
                      to={getFilterUrl({ rating: r.rating })}>
                      <Rating caption={" & up"} rating={r.rating} />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    className={rating === "all" ? "text-bold" : ""}
                    to={getFilterUrl({ rating: "all" })}>
                    <Rating caption={" & up"} rating={0} />
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col md={9}>
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <>
                <Row className="justify-content-between mb-3">
                  <Col md={6}>
                    <div>
                      {countProducts === 0 ? "No" : countProducts} Result
                      {query !== "all" && ":" + query}
                      {category !== "all" && ":" + category}
                      {price !== "all" && ": Price " + price}
                      {rating !== "all" && ": Rating" + rating + " & up"}
                      {query !== "all" ||
                      category !== "all" ||
                      rating !== "all" ||
                      [price] !== "all" ? (
                        <Button
                          variant="light"
                          onClick={() => navigate("/search")}>
                          <i className="fas fa-times-circle"></i>
                        </Button>
                      ) : null}
                    </div>
                  </Col>
                  <Col className="text-end">
                    Sort by{" "}
                    <select
                      value={order}
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}>
                      <option value="newest">Newest Arrivals</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price: High to Low</option>
                      <option value="toprated">Avg. Customer Reviews</option>
                    </select>
                  </Col>
                </Row>
                {products.lenght === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}

                <Row>
                  {products.map((product) => (
                    <Col sm={6} lg={4} className="mb-3" key={product._id}>
                      <MainScreenComponents
                        product={product}></MainScreenComponents>
                    </Col>
                  ))}
                </Row>
                <div>
                  {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                      key={x + 1}
                      className="mx-1"
                      to={getFilterUrl({ page: x + 1 })}>
                      <Button
                        className={Number(page) === x + 1 ? "text-bold" : ""}>
                        {x + 1}
                      </Button>
                    </LinkContainer>
                  ))}
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}