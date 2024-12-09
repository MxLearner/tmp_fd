<template>
  <div @click="toLogin">Login</div>
  <h2> {{ store.name }} </h2>
  <h1 @click="changeName">Change Name</h1>
  <el-tree :data="data" :props="defineProps" @node-click="handleNodeClick" />
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { useStore } from '../store/index';
  const router = useRouter();
  const store = useStore();

  // function toLogin() {
  //   router.push({
  //     name: 'index'
  //   });
  // }

  import { getCurrentInstance } from 'vue';
  const { proxy } = getCurrentInstance() as any;
  function login(): void {
    let data = {
      roleId: "A",
      username: "tj",
      password: "tj2024",
      sysType: "TJMovies"
    }
    proxy.$post("/index/login", data)
    .then((response: any) => {
      console.log(response);
      router.push({
        name: 'index'
      });
    });
  }
  function toLogin() {
    login();
  }

  function changeName(): void {
    store.name = 'TJMovies';
  }

  interface Tree {
    label: string
    children?: Tree[]
  }

  const handleNodeClick = (data: Tree) => {
    console.log(data);
  }

  const data: Tree[] = [
    {
      label: 'Level one 1',
      children: [
        {
          label: 'Level two 1-1',
          children: [
            {
              label: 'Level three 1-1-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 2',
      children: [
        {
          label: 'Level two 2-1',
          children: [
            {
              label: 'Level three 2-1-1',
            },
          ],
        },
        {
          label: 'Level two 2-2',
          children: [
            {
              label: 'Level three 2-2-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 3',
      children: [
        {
          label: 'Level two 3-1',
          children: [
            {
              label: 'Level three 3-1-1',
            },
          ],
        },
        {
          label: 'Level two 3-2',
          children: [
            {
              label: 'Level three 3-2-1',
            },
          ],
        },
      ],
    }
  ]

  const defineProps = {
    children: 'children',
    label: 'label',
  }
</script>