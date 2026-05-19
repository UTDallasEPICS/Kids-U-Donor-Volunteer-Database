import prisma, { prismaSoftDelete } from "@/app/utils/db";
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await request.json().catch(() => ({}));
    const idFromBody = typeof payload?.id === "string" ? payload.id.trim() : "";
    const idFromParams = typeof params?.id === "string" ? params.id.trim() : "";
    const id = idFromBody || idFromParams;

    if (!id) {
      return new Response(JSON.stringify({ error: "Grantor ID is required" }), { status: 400 });
    }
    const updatedGrantor = await prismaSoftDelete.grantor.delete({
      where: {
        id: id,
      },
    });
    return new Response(JSON.stringify(updatedGrantor), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
