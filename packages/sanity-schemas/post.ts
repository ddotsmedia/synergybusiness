/**
 * Drop this file into your Sanity Studio's `schemaTypes/` folder.
 *
 * Compatible with the `BlogPost` shape consumed by
 * `apps/web/lib/integrations/sanity.ts`.
 */

import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (R) => R.required().max(280),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Setup", value: "Setup" },
          { title: "Free Zones", value: "Free Zones" },
          { title: "Visas", value: "Visas" },
          { title: "Compliance", value: "Compliance" },
          { title: "Banking", value: "Banking" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "readingMinutes",
      type: "number",
      validation: (R) => R.required().min(1).max(60),
    }),
    defineField({
      name: "author",
      type: "object",
      fields: [
        { name: "name", type: "string", validation: (R) => R.required() },
        { name: "role", type: "string", validation: (R) => R.required() },
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: { decorators: [{ title: "Strong", value: "strong" }] },
        },
        {
          name: "callout",
          type: "object",
          title: "Callout",
          fields: [
            { name: "title", type: "string" },
            { name: "body", type: "text", rows: 3 },
          ],
          preview: {
            select: { title: "title", subtitle: "body" },
          },
        },
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      date: "publishedAt",
    },
  },
});
