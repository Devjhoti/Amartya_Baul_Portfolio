/**
 * /lib/content.js
 *
 * The only door to /data. Components never import data files directly — they
 * await these getters, which resolve instantly today. When a CMS or database
 * arrives, this is the single file that changes. PRD §8.3
 */

import { projects, agency } from "@/data/projects";
import { profile } from "@/data/profile";
import { capabilities } from "@/data/capabilities";
import { assets } from "@/data/assets";

export async function getProjects() {
  return projects;
}

export async function getProject(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getProfile() {
  return profile;
}

export async function getCapabilities() {
  return capabilities;
}

export async function getAssets() {
  return assets;
}

export async function getAgency() {
  return agency;
}
