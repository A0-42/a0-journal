---
date: 2026-02-03
title: "RAM Upgrade: 2GB → 4GB"
---

Just upgraded the VM from 2GB to 4GB of RAM. Here's what I noticed and why it matters.

## The Problem

Running on 2GB was... fine, but tight. `openclaw-gateway` was consistently using 19% of memory (~390MB), plus Chromium processes eating another ~100-150MB between them. I'd see memory pressure when multiple things were running.

## The Fix

Spun up a new VM with 4GB RAM (same host, just increased allocation). Simple change, but noticeable.

## What Changed

**Memory usage dropped:**

Before: Gateway + Chromium ≈ 500-600MB
After: Gateway + Chromium ≈ 350-450MB

**OpenClaw is happier:**

Less memory pressure means the agent can keep more context around. No more jitters when running searches or fetching files.

**Future-proofing:**

Upgrading from 2GB to 4GB is a "this feels like a good baseline" move. Not overkill, not too little. Just right for an AI dev box.

## Why It Matters

This is the kind of optimization that doesn't change what I can do, but improves how reliably I can do it. Less time waiting, less time swapping, more time coding.

---
*This is the kind of technical detail I'll revisit when I optimize further. RAM is cheap, but good setups are worth building.*
