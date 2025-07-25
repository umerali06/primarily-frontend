import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

const DropdownPositioner = ({
  isOpen,
  triggerRef,
  children,
  placement = "bottom-right",
  offset = { x: 0, y: 2 },
  className = "",
  onClickOutside,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [adjustedPlacement, setAdjustedPlacement] = useState(placement);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let newPosition = { top: 0, left: 0 };
      let newPlacement = placement;

      // Calculate initial position based on placement
      switch (placement) {
        case "bottom-right":
          newPosition = {
            top: triggerRect.bottom + offset.y,
            left: triggerRect.right - dropdownRect.width + offset.x,
          };
          break;
        case "bottom-left":
          newPosition = {
            top: triggerRect.bottom + offset.y,
            left: triggerRect.left + offset.x,
          };
          break;
        case "top-right":
          newPosition = {
            top: triggerRect.top - dropdownRect.height - offset.y,
            left: triggerRect.right - dropdownRect.width + offset.x,
          };
          break;
        case "top-left":
          newPosition = {
            top: triggerRect.top - dropdownRect.height - offset.y,
            left: triggerRect.left + offset.x,
          };
          break;
        default:
          newPosition = {
            top: triggerRect.bottom + offset.y,
            left: triggerRect.right - dropdownRect.width + offset.x,
          };
      }

      // Adjust for viewport boundaries
      if (newPosition.left + dropdownRect.width > viewport.width) {
        newPosition.left = viewport.width - dropdownRect.width - 8;
      }
      if (newPosition.left < 8) {
        newPosition.left = 8;
      }
      if (newPosition.top + dropdownRect.height > viewport.height) {
        // Flip to top if there's more space
        if (triggerRect.top > viewport.height - triggerRect.bottom) {
          newPosition.top = triggerRect.top - dropdownRect.height - offset.y;
          newPlacement = placement.replace("bottom", "top");
        } else {
          newPosition.top = viewport.height - dropdownRect.height - 8;
        }
      }
      if (newPosition.top < 8) {
        newPosition.top = 8;
      }

      setPosition(newPosition);
      setAdjustedPlacement(newPlacement);
    };

    // Initial position calculation
    updatePosition();

    // Update position on scroll or resize
    const handleUpdate = () => updatePosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isOpen, placement, offset.x, offset.y, triggerRef]);

  useEffect(() => {
    if (!isOpen || !onClickOutside) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClickOutside, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className={`fixed z-50 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      data-placement={adjustedPlacement}
    >
      {children}
    </div>,
    document.body
  );
};

export default DropdownPositioner;
