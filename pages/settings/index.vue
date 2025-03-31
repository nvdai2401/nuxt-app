<script setup lang="ts">
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Fetch folders data
const { data: folders, refresh } = await useFetch("/api/get-folders");

// State for editing
const editMode = ref(false);
const selectedFolder = ref<{ id: number; name: string } | null>(null);
const updatedName = ref("");
const updateStatus = ref<{ success: boolean; message: string } | null>(null);

// Handle edit click
const startEdit = (folder: any) => {
  selectedFolder.value = folder;
  updatedName.value = folder.name;
  editMode.value = true;
  updateStatus.value = null;
};

// Handle update submission
const updateFolder = async () => {
  if (!selectedFolder.value) return;

  try {
    updateStatus.value = null;

    const response = await $fetch("/api/update-folder", {
      method: "PATCH",
      body: {
        id: selectedFolder.value.id,
        name: updatedName.value,
      },
    });

    // Update success
    updateStatus.value = {
      success: true,
      message: "Folder updated successfully!",
    };

    // Refresh folder list
    refresh();

    // Reset edit mode after a short delay
    setTimeout(() => {
      editMode.value = false;
      selectedFolder.value = null;
    }, 1500);
  } catch (error: any) {
    // Update failed
    updateStatus.value = {
      success: false,
      message: error.message || "Failed to update folder",
    };
  }
};

// Cancel editing
const cancelEdit = () => {
  editMode.value = false;
  selectedFolder.value = null;
  updateStatus.value = null;
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>

    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline"> Cancel </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

    <!-- Folders list -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Your Folders</h2>

      <div v-if="!folders || folders.length === 0" class="text-gray-500">
        No folders found.
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="p-3 border rounded flex justify-between items-center"
        >
          <span>{{ folder.name }}</span>
          <button
            @click="startEdit(folder)"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <div
      v-if="editMode && selectedFolder"
      class="mt-4 p-4 border rounded bg-gray-50"
    >
      <h3 class="font-medium mb-2">Edit Folder</h3>

      <div class="mb-3">
        <label class="block text-sm mb-1">Folder Name</label>
        <input
          v-model="updatedName"
          type="text"
          class="w-full px-3 py-2 border rounded"
        />
      </div>

      <!-- Status message -->
      <div
        v-if="updateStatus"
        :class="[
          'p-2 mb-3 rounded text-sm',
          updateStatus.success
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800',
        ]"
      >
        {{ updateStatus.message }}
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2">
        <button
          @click="updateFolder"
          class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Changes
        </button>
        <button
          @click="cancelEdit"
          class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
