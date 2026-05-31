"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getAllBrands } from "@/services/brand.services";
import { getAllCategories } from "@/services/category.services";
import {
  ICreateColorGroupPayload,
  ICreateProductPayload,
  ICreateSpecificationPayload,
} from "@/services/product.services";
import { IBrand } from "@/types/brand.types";
import { ICategory } from "@/types/category.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createProductAction,
  uploadColorGroupImagesAction,
} from "@/app/(dashboardLayout)/admin/dashboard/products-management/_action";

// ── empty row helpers ────────────────────────────────────────
const emptyAttribute = () => ({ key: "", value: "" });
const emptyVariant = () => ({ sku: "", price: "", attributes: [emptyAttribute()] });
const emptyColorGroup = (): LocalColorGroup => ({
  colorValue: "",
  colorCode: "",
  variants: [emptyVariant()],
});
const emptySpec = () => ({ group: "", key: "", value: "" });

interface LocalAttribute { key: string; value: string }
interface LocalVariant { sku: string; price: string; attributes: LocalAttribute[] }
interface LocalColorGroup { colorValue: string; colorCode: string; variants: LocalVariant[] }
interface LocalSpec { group: string; key: string; value: string }

// colorGroupIndex → File[]
type ColorGroupFiles = Record<number, File[]>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProductSheet = ({ open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  // ── base fields ──────────────────────────────────────────
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);

  // ── specifications ───────────────────────────────────────
  const [specs, setSpecs] = useState<LocalSpec[]>([]);

  // ── color groups ─────────────────────────────────────────
  const [colorGroups, setColorGroups] = useState<LocalColorGroup[]>([
    emptyColorGroup(),
  ]);

  // ── images per color group ───────────────────────────────
  const [colorGroupFiles, setColorGroupFiles] = useState<ColorGroupFiles>({});
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const [submitting, setSubmitting] = useState(false);

  // ── remote data ──────────────────────────────────────────
  const { data: brandsRes } = useQuery({
    queryKey: ["brands-all"],
    queryFn: () => getAllBrands("limit=200"),
    enabled: open,
  });
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => getAllCategories("limit=200"),
    enabled: open,
  });

  const brands: IBrand[] = brandsRes?.data ?? [];
  const categories: ICategory[] = categoriesRes?.data ?? [];

  // ── spec helpers ─────────────────────────────────────────
  const addSpec = () => setSpecs((p) => [...p, emptySpec()]);
  const removeSpec = (i: number) => setSpecs((p) => p.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: keyof LocalSpec, val: string) =>
    setSpecs((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));

  // ── color group helpers ──────────────────────────────────
  const addColorGroup = () => setColorGroups((p) => [...p, emptyColorGroup()]);
  const removeColorGroup = (ci: number) =>
    setColorGroups((p) => p.filter((_, idx) => idx !== ci));
  const updateColorGroup = (ci: number, field: "colorValue" | "colorCode", val: string) =>
    setColorGroups((p) =>
      p.map((cg, idx) => (idx === ci ? { ...cg, [field]: val } : cg)),
    );

  // ── variant helpers ──────────────────────────────────────
  const addVariant = (ci: number) =>
    setColorGroups((p) =>
      p.map((cg, idx) =>
        idx === ci ? { ...cg, variants: [...cg.variants, emptyVariant()] } : cg,
      ),
    );
  const removeVariant = (ci: number, vi: number) =>
    setColorGroups((p) =>
      p.map((cg, idx) =>
        idx === ci
          ? { ...cg, variants: cg.variants.filter((_, vidx) => vidx !== vi) }
          : cg,
      ),
    );
  const updateVariant = (
    ci: number,
    vi: number,
    field: "sku" | "price",
    val: string,
  ) =>
    setColorGroups((p) =>
      p.map((cg, idx) =>
        idx === ci
          ? {
              ...cg,
              variants: cg.variants.map((v, vidx) =>
                vidx === vi ? { ...v, [field]: val } : v,
              ),
            }
          : cg,
      ),
    );

  // ── attribute helpers ────────────────────────────────────
  const addAttribute = (ci: number, vi: number) =>
    setColorGroups((p) =>
      p.map((cg, idx) =>
        idx === ci
          ? {
              ...cg,
              variants: cg.variants.map((v, vidx) =>
                vidx === vi
                  ? { ...v, attributes: [...v.attributes, emptyAttribute()] }
                  : v,
              ),
            }
          : cg,
      ),
    );
  const removeAttribute = (ci: number, vi: number, ai: number) =>
    setColorGroups((p) =>
      p.map((cg, idx) =>
        idx === ci
          ? {
              ...cg,
              variants: cg.variants.map((v, vidx) =>
                vidx === vi
                  ? {
                      ...v,
                      attributes: v.attributes.filter((_, aidx) => aidx !== ai),
                    }
                  : v,
              ),
            }
          : cg,
      ),
    );
  const updateAttribute = (
    ci: number,
    vi: number,
    ai: number,
    field: "key" | "value",
    val: string,
  ) =>
    setColorGroups((p) =>
      p.map((cg, idx) =>
        idx === ci
          ? {
              ...cg,
              variants: cg.variants.map((v, vidx) =>
                vidx === vi
                  ? {
                      ...v,
                      attributes: v.attributes.map((a, aidx) =>
                        aidx === ai ? { ...a, [field]: val } : a,
                      ),
                    }
                  : v,
              ),
            }
          : cg,
      ),
    );

  // ── image file helpers ───────────────────────────────────
  const handleFileChange = (ci: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setColorGroupFiles((prev) => ({
      ...prev,
      [ci]: [...(prev[ci] ?? []), ...files],
    }));
    // reset input so same file can be re-added after removal
    if (fileInputRefs.current[ci]) fileInputRefs.current[ci]!.value = "";
  };

  const removeFile = (ci: number, fi: number) => {
    setColorGroupFiles((prev) => ({
      ...prev,
      [ci]: (prev[ci] ?? []).filter((_, idx) => idx !== fi),
    }));
  };

  // ── reset ────────────────────────────────────────────────
  const resetForm = () => {
    setName("");
    setDescription("");
    setBrandId("");
    setCategoryId("");
    setIsActive(true);
    setSpecs([]);
    setColorGroups([emptyColorGroup()]);
    setColorGroupFiles({});
  };

  // ── submit ───────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsedColorGroups: ICreateColorGroupPayload[] = colorGroups.map(
      (cg) => ({
        colorValue: cg.colorValue.trim(),
        colorCode: cg.colorCode.trim() || undefined,
        variants: cg.variants.map((v) => ({
          sku: v.sku.trim() || undefined,
          price: parseFloat(v.price),
          attributes: v.attributes.map((a) => ({
            key: a.key.trim(),
            value: a.value.trim(),
          })),
        })),
      }),
    );

    const parsedSpecs: ICreateSpecificationPayload[] = specs
      .filter((s) => s.group && s.key && s.value)
      .map((s) => ({
        group: s.group.trim(),
        key: s.key.trim(),
        value: s.value.trim(),
      }));

    const payload: ICreateProductPayload = {
      name: name.trim(),
      description: description.trim(),
      brandId,
      categoryId,
      isActive,
      colorGroups: parsedColorGroups,
      ...(parsedSpecs.length > 0 && { specifications: parsedSpecs }),
    };

    try {
      setSubmitting(true);

      // Step 1: create product + color groups + variants
      const created = await createProductAction(payload);
      const createdColorGroups = created.data.colorGroups;

      // Step 2: upload images per color group (in parallel)
      const uploadResults = await Promise.allSettled(
        colorGroups.map((_, ci) => {
          const files = colorGroupFiles[ci] ?? [];
          if (!files.length) return Promise.resolve();

          const formData = new FormData();
          files.forEach((file) => formData.append("images", file));

          return uploadColorGroupImagesAction(
            created.data.id,
            createdColorGroups[ci].id,
            formData,
          );
        }),
      );

      const failedUploads = uploadResults.filter((r) => r.status === "rejected");
      if (failedUploads.length > 0) {
        toast.warning(
          `Product created, but ${failedUploads.length} image upload(s) failed. You can add images later.`,
        );
      } else {
        toast.success("Product created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create product";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto flex flex-col gap-0 p-0"
      >
        <SheetHeader className="px-6 py-5 border-b shrink-0">
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new product.
          </SheetDescription>
        </SheetHeader>

        <form
          id="create-product-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-8"
        >
          {/* ── Basic Info ─────────────────────────────────── */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Basic Info
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="p-name">Name *</Label>
              <Input
                id="p-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple iPhone 15 Pro"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Description *</Label>
              <Textarea
                id="p-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Brand *</Label>
                <Select value={brandId} onValueChange={setBrandId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={isActive ? "true" : "false"}
                onValueChange={(v) => setIsActive(v === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* ── Specifications ─────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Specifications
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>

            {specs.map((spec, si) => (
              <div key={si} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                <div className="space-y-1">
                  {si === 0 && <Label className="text-xs">Group</Label>}
                  <Input
                    value={spec.group}
                    onChange={(e) => updateSpec(si, "group", e.target.value)}
                    placeholder="e.g. Screen"
                  />
                </div>
                <div className="space-y-1">
                  {si === 0 && <Label className="text-xs">Key</Label>}
                  <Input
                    value={spec.key}
                    onChange={(e) => updateSpec(si, "key", e.target.value)}
                    placeholder="e.g. Size"
                  />
                </div>
                <div className="space-y-1">
                  {si === 0 && <Label className="text-xs">Value</Label>}
                  <Input
                    value={spec.value}
                    onChange={(e) => updateSpec(si, "value", e.target.value)}
                    placeholder="e.g. 6.1&quot;"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSpec(si)}
                  className="text-destructive hover:text-destructive mt-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </section>

          {/* ── Color Groups ───────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Color Groups *
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addColorGroup}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Color
              </Button>
            </div>

            {colorGroups.map((cg, ci) => (
              <div key={ci} className="rounded-lg border p-4 space-y-4">
                {/* Color header */}
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Color Name *</Label>
                      <Input
                        value={cg.colorValue}
                        onChange={(e) =>
                          updateColorGroup(ci, "colorValue", e.target.value)
                        }
                        placeholder="e.g. Noir Titanium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Color Code (hex)</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          value={cg.colorCode}
                          onChange={(e) =>
                            updateColorGroup(ci, "colorCode", e.target.value)
                          }
                          placeholder="#3C3C3D"
                        />
                        {cg.colorCode && (
                          <span
                            className="h-8 w-8 shrink-0 rounded-md border"
                            style={{ backgroundColor: cg.colorCode }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {colorGroups.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColorGroup(ci)}
                      className="text-destructive hover:text-destructive mt-5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      Images
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => fileInputRefs.current[ci]?.click()}
                    >
                      <ImagePlus className="h-3.5 w-3.5 mr-1" />
                      Add Images
                    </Button>
                    <input
                      ref={(el) => { fileInputRefs.current[ci] = el; }}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(ci, e)}
                    />
                  </div>

                  {(colorGroupFiles[ci] ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(colorGroupFiles[ci] ?? []).map((file, fi) => (
                        <div
                          key={fi}
                          className="relative group h-16 w-16 rounded-lg border overflow-hidden bg-muted"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(ci, fi)}
                            className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                          {fi === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Variants */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      Variants
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => addVariant(ci)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Variant
                    </Button>
                  </div>

                  {cg.variants.map((v, vi) => (
                    <div
                      key={vi}
                      className="rounded-md border bg-muted/30 p-3 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">SKU</Label>
                            <Input
                              value={v.sku}
                              onChange={(e) =>
                                updateVariant(ci, vi, "sku", e.target.value)
                              }
                              placeholder="e.g. IP15P-BLK-128"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Price *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={v.price}
                              onChange={(e) =>
                                updateVariant(ci, vi, "price", e.target.value)
                              }
                              placeholder="e.g. 1229"
                              className="h-8 text-sm"
                              required
                            />
                          </div>
                        </div>
                        {cg.variants.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariant(ci, vi)}
                            className="text-destructive hover:text-destructive h-8 w-8 mt-4"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      {/* Attributes */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Attributes
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => addAttribute(ci, vi)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                        {v.attributes.map((attr, ai) => (
                          <div
                            key={ai}
                            className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                          >
                            <Input
                              value={attr.key}
                              onChange={(e) =>
                                updateAttribute(ci, vi, ai, "key", e.target.value)
                              }
                              placeholder="e.g. storage"
                              className="h-7 text-xs"
                              required
                            />
                            <Input
                              value={attr.value}
                              onChange={(e) =>
                                updateAttribute(ci, vi, ai, "value", e.target.value)
                              }
                              placeholder="e.g. 128Go"
                              className="h-7 text-xs"
                              required
                            />
                            {v.attributes.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAttribute(ci, vi, ai)}
                                className="text-destructive hover:text-destructive h-7 w-7"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </form>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={submitting}
            form="create-product-form"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Product
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateProductSheet;
