import React from "react";

export default function StarsComponent({ stars, setStars, click }) {
  function doNothing() {
    // do nothing
  }
  return (
    <div className={click ? " rating clicking" : "rating"}>
      <i
        onClick={(e) => {
          click ? setStars(e.target.id) : doNothing();
        }}
        id="1"
        className={
          stars >= 1
            ? "fas fa-star"
            : stars >= 0.5
            ? "fas fa-star-half-alt"
            : "far fa-star"
        }
      />
      <i
        onClick={(e) => {
          click ? setStars(e.target.id) : doNothing();
        }}
        id="2"
        className={
          stars >= 2
            ? "fas fa-star"
            : stars >= 1.5
            ? "fas fa-star-half-alt"
            : "far fa-star"
        }
      />
      <i
        onClick={(e) => {
          click ? setStars(e.target.id) : doNothing();
        }}
        id="3"
        className={
          stars >= 3
            ? "fas fa-star"
            : stars >= 2.5
            ? "fas fa-star-half-alt"
            : "far fa-star"
        }
      />
      <i
        onClick={(e) => {
          click ? setStars(e.target.id) : doNothing();
        }}
        id="4"
        className={
          stars >= 4
            ? "fas fa-star"
            : stars >= 3.5
            ? "fas fa-star-half-alt"
            : "far fa-star"
        }
      />
      <i
        onClick={(e) => {
          click ? setStars(e.target.id) : doNothing();
        }}
        id="5"
        className={
          stars >= 5
            ? "fas fa-star"
            : stars >= 4.5
            ? "fas fa-star-half-alt"
            : "far fa-star"
        }
      />
    </div>
  );
}
