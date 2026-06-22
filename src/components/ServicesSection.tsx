import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { getServiceItems } from "@/lib/markdown";
import AnimatedAsset from "@/components/AnimatedAsset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GroupedTier {
  tier: string;
  label: string;
  description: string;
  items: ReturnType<typeof getServiceItems>;
}

const tierOrder = ["major", "minor", "nano"];

const defaultServiceOverlayText = "Learn more";

const fallbackItems = [
  { slug: "_demo-1", frontmatter: { title: "Data Pipeline Architecture", tier: "major", tier_label: "Major Services", tier_description: "End-to-end solutions for complex data challenges", sort_order: 1, service_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52,