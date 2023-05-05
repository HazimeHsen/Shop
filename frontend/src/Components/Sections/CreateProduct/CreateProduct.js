import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Store } from "../../Store/Store";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import axios from "axios";
import ErrorCatch from "../../../ErrorCatch";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PRODUCT_REQUEST":
      return { ...state, loading: true };
    case "PRODUCT_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "PRODUCT_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function CreateProduct() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const productId = id;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: false,
    product: {},
    error: "",
  });
  const [name, setName] = useState(
    productId ? product.name : "Sample product" + Date.now()
  );
  const [slug, setSlug] = useState("Sample slug" + Date.now());
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("/image/p1.webp");
  const [category, setCategory] = useState("Sample category");
  const [countInStock, setCountInStock] = useState(0);
  const [brand, setBrand] = useState("Sample brand");
  const [description, setDescription] = useState("Sample product");

  useEffect(() => {
    if (productId) {
      const fetchData = async () => {
        try {
          dispatch({ type: "PRODUCT_REQUEST" });
          const { data } = await axios.get(`/api/products/${productId}`);
          dispatch({ type: "PRODUCT_SUCCESS", payload: data });
          setName(data.name);
          setSlug(data.slug);
          setPrice(data.price);
          setImage(data.image);
          setCategory(data.category);
          setBrand(data.brand);
          setDescription(data.description);
          setCountInStock(data.countInStock);
        } catch (error) {
          dispatch({ type: "PRODUCT_FAIL", payload: ErrorCatch(error) });
        }
      };
      fetchData();
    }
  }, [productId]);
  const createProduct = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axios.post(
        "/api/products/create",
        {
          name,
          slug,
          price,
          image,
          category,
          countInStock,
          brand,
          description,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "FETCH_SUCCESS" });
      toast.success("Product Created");
      navigate("/admin/productlist");
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      toast.error(ErrorCatch(error));
    }
  };
  const editProduct = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axios.put(
        `/api/products/edit/${productId}`,
        {
          name,
          slug,
          price,
          image,
          category,
          countInStock,
          brand,
          description,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "FETCH_SUCCESS" });
      toast.success("Product Created");
      navigate("/admin/productlist");
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      toast.error(ErrorCatch(error));
    }
  };
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "FETCH_SUCCESS" });

      toast.success("Image uploaded successfully");
      setImage(`/image/${data.filename}`);
    } catch (err) {
      toast.error(ErrorCatch(err));
      dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(err) });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>{productId ? "Edit" : "Create"} Product</title>
      </Helmet>
      <h1 className="my-3">{productId ? "Edit" : "Create"} Product </h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <br />
            <input type="file" onChange={uploadFileHandler} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            {productId ? (
              <Button onClick={editProduct}>Edit</Button>
            ) : (
              <Button onClick={createProduct}>Create</Button>
            )}
          </div>
        </Form>
      )}
    </Container>
  );
}
