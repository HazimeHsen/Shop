import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store/Store";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ErrorCatch from "../../../ErrorCatch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_SUCCESS":
      return { ...state, loading: false };
    case "UPDATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function UserProfile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const [name, setName] = useState(userInfo?.name ?? "");
  const [email, setEmail] = useState(userInfo?.email ?? "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      "/api/users/profile",
      {
        name,
        email,
        password,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: "UPDATE_SUCCESS" });
    ctxDispatch({ type: "USER_SIGNIN", payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
    toast.success("User updated successfully");
    try {
    } catch (error) {
      ctxDispatch({ type: "FETCH_FAIL" });
      toast.error(ErrorCatch(error));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
}
